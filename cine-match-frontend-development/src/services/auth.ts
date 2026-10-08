/**
 * Mock authentication service.
 *
 * Accounts and sessions live in the browser only.
 * Later this can be replaced with real FastAPI authentication.
 */

export type Gender = 'male' | 'female'

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  gender: Gender
  createdAt: string
}

export interface SignInInput {
  identifier: string
  password: string
  remember: boolean
}

export interface SignUpInput {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  gender: Gender
}

export type AuthField =
  | 'firstName'
  | 'lastName'
  | 'username'
  | 'email'
  | 'password'
  | 'gender'
  | 'identifier'

export class AuthError extends Error {
  readonly field?: AuthField

  constructor(message: string, field?: AuthField) {
    super(message)
    this.name = 'AuthError'
    this.field = field
  }
}

export interface AuthService {
  getSession(): AuthUser | null
  signIn(input: SignInInput): Promise<AuthUser>
  signUp(input: SignUpInput): Promise<AuthUser>
  signOut(): void

  updateProfile(
    patch: Partial<
      Pick<
        AuthUser,
        'firstName' | 'lastName' | 'username' | 'gender'
      >
    >,
  ): AuthUser | null
}

interface StoredUser extends AuthUser {
  passwordHash: string
}

const USERS_KEY = 'cinematch:users'
const SESSION_KEY = 'cinematch:session'

const wait = (ms: number) =>
  new Promise<void>((resolve) =>
    setTimeout(resolve, ms),
  )

// ---------------------------------------------------------
// STORAGE
// ---------------------------------------------------------

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed as StoredUser[]
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users),
  )
}

// ---------------------------------------------------------
// SAFE HELPERS
// ---------------------------------------------------------

function safeLower(value: unknown) {
  return typeof value === 'string'
    ? value.trim().toLowerCase()
    : ''
}

function createId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `user-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`
}

// ---------------------------------------------------------
// PASSWORD
// ---------------------------------------------------------

async function hashPassword(
  email: string,
  password: string,
): Promise<string> {
  const input = `${email}:${password}`

  if (
    typeof crypto !== 'undefined' &&
    crypto.subtle
  ) {
    const digest =
      await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(input),
      )

    return Array.from(
      new Uint8Array(digest),
    )
      .map((b) =>
        b.toString(16).padStart(2, '0'),
      )
      .join('')
  }

  return btoa(input)
}

// ---------------------------------------------------------
// PUBLIC USER
// ---------------------------------------------------------

function toPublic(
  user: StoredUser,
): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    username:
      user.username ??
      user.firstName ??
      'User',
    email: user.email ?? '',
    gender:
      user.gender === 'female'
        ? 'female'
        : 'male',
    createdAt:
      user.createdAt ??
      new Date().toISOString(),
  }
}

// ---------------------------------------------------------
// SESSION
// ---------------------------------------------------------

function persistSession(
  userId: string,
  remember: boolean,
) {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)

  const store = remember
    ? localStorage
    : sessionStorage

  store.setItem(
    SESSION_KEY,
    JSON.stringify({ userId }),
  )
}

function readSessionUserId():
  | string
  | null {
  try {
    const raw =
      sessionStorage.getItem(
        SESSION_KEY,
      ) ??
      localStorage.getItem(
        SESSION_KEY,
      )

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)

    return typeof parsed?.userId ===
      'string'
      ? parsed.userId
      : null
  } catch {
    return null
  }
}

// ---------------------------------------------------------
// AUTH SERVICE
// ---------------------------------------------------------

export const authService: AuthService = {
  getSession() {
    const userId =
      readSessionUserId()

    if (!userId) {
      return null
    }

    const user = readUsers().find(
      (item) => item.id === userId,
    )

    return user
      ? toPublic(user)
      : null
  },

  // -------------------------------------------------------
  // SIGN IN
  // -------------------------------------------------------

  async signIn({
    identifier,
    password,
    remember,
  }) {
    await wait(500)

    const normalizedIdentifier =
      safeLower(identifier)

    if (!normalizedIdentifier) {
      throw new AuthError(
        'Please enter your username or email.',
        'identifier',
      )
    }

    const users = readUsers()

    const user = users.find(
      (item) => {
        const email =
          safeLower(item.email)

        const username =
          safeLower(item.username)

        return (
          email ===
            normalizedIdentifier ||
          username ===
            normalizedIdentifier
        )
      },
    )

    if (!user) {
      throw new AuthError(
        'We could not find an account with that username or email.',
        'identifier',
      )
    }

    const expectedHash =
      await hashPassword(
        user.email,
        password,
      )

    if (
      user.passwordHash !==
      expectedHash
    ) {
      throw new AuthError(
        'Incorrect password. Please try again.',
        'password',
      )
    }

    persistSession(
      user.id,
      remember,
    )

    return toPublic(user)
  },

  // -------------------------------------------------------
  // SIGN UP
  // -------------------------------------------------------

  async signUp({
    firstName,
    lastName,
    username,
    email,
    password,
    gender,
  }) {
    await wait(500)

    const cleanFirstName =
      firstName.trim()

    const cleanLastName =
      lastName.trim()

    const cleanUsername =
      username.trim()

    const normalizedEmail =
      safeLower(email)

    if (!cleanFirstName) {
      throw new AuthError(
        'First name is required.',
        'firstName',
      )
    }

    if (!cleanLastName) {
      throw new AuthError(
        'Last name is required.',
        'lastName',
      )
    }

    if (!cleanUsername) {
      throw new AuthError(
        'Username is required.',
        'username',
      )
    }

    if (!normalizedEmail) {
      throw new AuthError(
        'Email is required.',
        'email',
      )
    }

    if (password.length < 6) {
      throw new AuthError(
        'Password must be at least 6 characters.',
        'password',
      )
    }

    if (
      gender !== 'male' &&
      gender !== 'female'
    ) {
      throw new AuthError(
        'Please select your gender.',
        'gender',
      )
    }

    const users = readUsers()

    const emailExists =
      users.some(
        (item) =>
          safeLower(item.email) ===
          normalizedEmail,
      )

    if (emailExists) {
      throw new AuthError(
        'An account with this email already exists. Try signing in.',
        'email',
      )
    }

    const usernameExists =
      users.some(
        (item) =>
          safeLower(item.username) ===
          safeLower(cleanUsername),
      )

    if (usernameExists) {
      throw new AuthError(
        'This username is already taken. Please choose another one.',
        'username',
      )
    }

    const passwordHash =
      await hashPassword(
        normalizedEmail,
        password,
      )

    const user: StoredUser = {
      id: createId(),
      firstName:
        cleanFirstName,
      lastName:
        cleanLastName,
      username:
        cleanUsername,
      email:
        normalizedEmail,
      gender,
      createdAt:
        new Date().toISOString(),
      passwordHash,
    }

    writeUsers([
      ...users,
      user,
    ])

    persistSession(
      user.id,
      true,
    )

    return toPublic(user)
  },

  // -------------------------------------------------------
  // SIGN OUT
  // -------------------------------------------------------

  signOut() {
    localStorage.removeItem(
      SESSION_KEY,
    )

    sessionStorage.removeItem(
      SESSION_KEY,
    )
  },

  // -------------------------------------------------------
  // UPDATE PROFILE
  // -------------------------------------------------------

  updateProfile(patch) {
    const userId =
      readSessionUserId()

    if (!userId) {
      return null
    }

    const users = readUsers()

    const index =
      users.findIndex(
        (item) =>
          item.id === userId,
      )

    if (index === -1) {
      return null
    }

    if (patch.username) {
      const nextUsername =
        safeLower(
          patch.username,
        )

      const exists =
        users.some(
          (item, userIndex) =>
            userIndex !== index &&
            safeLower(
              item.username,
            ) === nextUsername,
        )

      if (exists) {
        return null
      }
    }

    users[index] = {
      ...users[index],

      firstName:
        patch.firstName !==
        undefined
          ? patch.firstName.trim()
          : users[index]
              .firstName,

      lastName:
        patch.lastName !==
        undefined
          ? patch.lastName.trim()
          : users[index]
              .lastName,

      username:
        patch.username !==
        undefined
          ? patch.username.trim()
          : users[index]
              .username,

      gender:
        patch.gender ??
        users[index].gender,
    }

    writeUsers(users)

    return toPublic(
      users[index],
    )
  },
}