"""
kobai_export_explorer.py

Purpose: Inspect a JSON export from the Kobai knowledge graph tool and
extract anything that looks like a semantic model or physical data binding.

Usage:
    python kobai_export_explorer.py path/to/export.json

Outputs (written next to the input file):
    1. <name>_structure.txt   - full key-path skeleton of the JSON
    2. <name>_inventory.csv   - one row per discovered property/column
                                with concept, property, datatype, and any
                                table/column binding found
    3. Console summary        - counts and the most promising sections
"""

import json
import sys
import csv
from pathlib import Path
from collections import Counter

# Keys that usually indicate semantic model elements
MODEL_HINTS = {
    "concept", "concepts", "class", "classes", "entity", "entities",
    "property", "properties", "attribute", "attributes",
    "relation", "relations", "relationship", "relationships",
    "predicate", "predicates", "domain", "range", "uri", "iri", "label",
}

# Keys that usually indicate physical data bindings
MAPPING_HINTS = {
    "table", "tables", "tablename", "table_name",
    "column", "columns", "columnname", "column_name", "field", "fields",
    "datasource", "data_source", "datasources", "source", "sources",
    "mapping", "mappings", "connection", "connections", "schema",
    "database", "db", "sql", "query", "queries", "view",
}


def walk(node, path, structure_lines, hits, max_list_sample=3):
    """Recursively record the key structure and collect hint matches."""
    if isinstance(node, dict):
        for k, v in node.items():
            new_path = f"{path}.{k}" if path else k
            structure_lines.add(key_signature(new_path, v))
            kl = k.lower()
            if kl in MODEL_HINTS or kl in MAPPING_HINTS:
                hits.append((new_path, kl, preview(v)))
            walk(v, new_path, structure_lines, hits)
    elif isinstance(node, list):
        # Sample only the first few items so huge exports stay fast
        for i, item in enumerate(node[:max_list_sample]):
            walk(item, f"{path}[]", structure_lines, hits)


def key_signature(path, value):
    t = type(value).__name__
    if isinstance(value, list):
        t = f"list[{len(value)}]"
    return f"{path} :: {t}"


def preview(value, limit=120):
    s = json.dumps(value, default=str)
    return s[:limit] + ("..." if len(s) > limit else "")


def find_records(node, path=""):
    """
    Yield dicts that look like property or mapping records:
    any dict that contains at least one mapping hint or a
    name-plus-datatype pair.
    """
    if isinstance(node, dict):
        keys_lower = {k.lower() for k in node.keys()}
        has_mapping = keys_lower & MAPPING_HINTS
        has_name = keys_lower & {"name", "label", "uri", "iri", "id"}
        has_type = keys_lower & {"datatype", "data_type", "type", "range"}
        if has_mapping or (has_name and has_type):
            yield path, node
        for k, v in node.items():
            yield from find_records(v, f"{path}.{k}" if path else k)
    elif isinstance(node, list):
        for i, item in enumerate(node):
            yield from find_records(item, f"{path}[{i}]")


def flatten_record(rec):
    """Pull the interesting fields out of a candidate record."""
    out = {}
    for k, v in rec.items():
        kl = k.lower()
        if kl in ("name", "label"):
            out["name"] = v
        elif kl in ("uri", "iri", "id"):
            out.setdefault("identifier", v)
        elif kl in ("datatype", "data_type", "type", "range"):
            out["datatype"] = v if not isinstance(v, (dict, list)) else preview(v, 60)
        elif kl in ("table", "tablename", "table_name", "view"):
            out["table"] = v
        elif kl in ("column", "columnname", "column_name", "field"):
            out["column"] = v
        elif kl in ("datasource", "data_source", "source", "database", "schema"):
            out["datasource"] = v if not isinstance(v, (dict, list)) else preview(v, 60)
        elif kl in ("concept", "class", "entity", "domain"):
            out["concept"] = v if not isinstance(v, (dict, list)) else preview(v, 60)
        elif kl in ("sql", "query"):
            out["query"] = preview(v, 200)
    return out


def main():
    if len(sys.argv) != 2:
        print("Usage: python kobai_export_explorer.py path/to/export.json")
        sys.exit(1)

    in_path = Path(sys.argv[1])
    data = json.loads(in_path.read_text(encoding="utf-8"))

    structure_lines = set()
    hits = []
    walk(data, "", structure_lines, hits)

    # Write structure skeleton
    struct_path = in_path.with_name(in_path.stem + "_structure.txt")
    struct_path.write_text("\n".join(sorted(structure_lines)), encoding="utf-8")

    # Collect candidate records
    rows = []
    for path, rec in find_records(data):
        flat = flatten_record(rec)
        if flat:
            flat["json_path"] = path
            rows.append(flat)

    # Write inventory CSV
    inv_path = in_path.with_name(in_path.stem + "_inventory.csv")
    fieldnames = ["concept", "name", "identifier", "datatype",
                  "datasource", "table", "column", "query", "json_path"]
    with inv_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)

    # Console summary
    hint_counts = Counter(h[1] for h in hits)
    print(f"Read: {in_path}")
    print(f"Structure skeleton: {struct_path}")
    print(f"Inventory rows: {len(rows)} -> {inv_path}")
    print("\nHint keys found (key: count):")
    for k, c in hint_counts.most_common():
        print(f"  {k}: {c}")

    tables = sorted({str(r.get("table")) for r in rows if r.get("table")})
    if tables:
        print(f"\nDistinct tables discovered ({len(tables)}):")
        for t in tables:
            print(f"  {t}")
    else:
        print("\nNo physical table bindings found in this export.")
        print("The export likely contains only the semantic model.")
        print("Ask the owner for a data source or mapping export from Kobai.")


if __name__ == "__main__":
    main()