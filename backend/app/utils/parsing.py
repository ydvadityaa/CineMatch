# """Small parsing helpers used while normalising the CSV in-memory."""
# from __future__ import annotations

# from typing import List

# import pandas as pd


# def split_csv_list(value: object) -> List[str]:
#     """Convert a comma-separated string cell into a cleaned ``list[str]``.

#     Empty / NaN cells become ``[]``. Whitespace is trimmed and empty tokens
#     are dropped.
#     """
#     if value is None or (isinstance(value, float) and pd.isna(value)):
#         return []
#     if isinstance(value, list):
#         return [str(v).strip() for v in value if str(v).strip()]
#     text = str(value).strip()
#     if not text:
#         return []
#     return [part.strip() for part in text.split(",") if part.strip()]


# def clean_optional(value: object):
#     """Return ``None`` for pandas NaN / empty strings, otherwise ``value``."""
#     if value is None:
#         return None
#     if isinstance(value, float) and pd.isna(value):
#         return None
#     if isinstance(value, str) and value.strip() == "":
#         return None
#     return value

"""Small parsing helpers used while normalising the CSV in-memory."""
from __future__ import annotations

from typing import List

import pandas as pd


def split_csv_list(value: object) -> List[str]:
    """Convert a comma-separated string cell into a cleaned list[str]."""

    if value is None:
        return []

    try:
        if pd.isna(value):
            return []
    except (TypeError, ValueError):
        pass

    if isinstance(value, list):
        return [
            str(v).strip()
            for v in value
            if str(v).strip()
            and str(v).strip().lower() not in {"<na>", "nan"}
        ]

    text = str(value).strip()

    if not text or text.lower() in {"<na>", "nan"}:
        return []

    return [
        part.strip()
        for part in text.split(",")
        if part.strip()
        and part.strip().lower() not in {"<na>", "nan"}
    ]


def clean_optional(value: object):
    """Return None for pandas NaN / pd.NA / empty strings, otherwise value."""

    if value is None:
        return None

    try:
        if pd.isna(value):
            return None
    except (TypeError, ValueError):
        pass

    if isinstance(value, str) and value.strip() == "":
        return None

    return value