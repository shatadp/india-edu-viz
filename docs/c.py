"""
Scan all CSV files in a folder (e.g. SAP table extracts: MARA, MARC, MARD, EKES).
For each file, find columns that have at least one non-empty value,
and write the filled column headers to an output CSV, arranged as:
  - 30 header names per column
  - one blank column between each column of names
"""

import pandas as pd
from pathlib import Path

# ---- settings ----
INPUT_FOLDER = Path("input_csvs")      # folder containing MARA.csv, MARC.csv, etc.
OUTPUT_FOLDER = Path("output_csvs")    # results are written here
ROWS_PER_COLUMN = 30
# ------------------

OUTPUT_FOLDER.mkdir(exist_ok=True)


def column_is_filled(series: pd.Series) -> bool:
    """True if the column has at least one non-blank, non-null value."""
    s = series.dropna().astype(str).str.strip()
    return bool((s != "").any())


def process_file(csv_path: Path) -> None:
    df = pd.read_csv(csv_path, dtype=str)

    filled_headers = [col for col in df.columns if column_is_filled(df[col])]

    if not filled_headers:
        print(f"{csv_path.name}: no filled columns found, skipping.")
        return

    # split header list into chunks of ROWS_PER_COLUMN
    chunks = [
        filled_headers[i : i + ROWS_PER_COLUMN]
        for i in range(0, len(filled_headers), ROWS_PER_COLUMN)
    ]

    # build output layout: data column, blank gap column, data column, ...
    output_columns = []
    for idx, chunk in enumerate(chunks):
        padded = chunk + [""] * (ROWS_PER_COLUMN - len(chunk))
        output_columns.append(padded)
        if idx < len(chunks) - 1:          # gap column between chunks
            output_columns.append([""] * ROWS_PER_COLUMN)

    out_df = pd.DataFrame(zip(*output_columns))

    out_path = OUTPUT_FOLDER / f"{csv_path.stem}_filled_columns.csv"
    out_df.to_csv(out_path, index=False, header=False)
    print(f"{csv_path.name}: {len(filled_headers)} filled columns -> {out_path.name}")


def main() -> None:
    csv_files = sorted(INPUT_FOLDER.glob("*.csv"))
    if not csv_files:
        print(f"No CSV files found in {INPUT_FOLDER.resolve()}")
        return
    for csv_file in csv_files:
        process_file(csv_file)


if __name__ == "__main__":
    main()
