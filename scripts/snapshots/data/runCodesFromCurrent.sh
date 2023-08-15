#!/bin/bash

# Define the list of codes
cu_codes=(
  "core-units/GOV-001"
  "core-units/RWF-001"
  "core-units/GRO-001"
  "core-units/ORA-001"
  "core-units/COM-001"
  "core-units/DAIF-001"
  "core-units/SH-001"
  "core-units/DUX-001"
  "core-units/SNE-001"
  "core-units/DIN-001"
  "core-units/DECO-001"
  "core-units/SF-001"
  "core-units/TECH-001"
  "core-units/EVENTS-001"
  "core-units/CES-001"
  "core-units/PE-001"
  "core-units/RISK-001"
  "delegates"
  "spfs/SPF1"
  "spfs/SPF3"
  "spfs/SPF7"
)

ecosystem_codes=(
  "ecosystem-actors/BA-LABS"
  "ecosystem-actors/CHRONICLE"
  "ecosystem-actors/DEWIZ"
  "ecosystem-actors/JETSTREAM"
  "ecosystem-actors/PHOENIX"
  "ecosystem-actors/PULLUP"
  "ecosystem-actors/SIDESTREAM"
  "ecosystem-actors/TECHOPS"
  "ecosystem-actors/VIRIDIAN"
)

# Get the current date in the format "YYYY/MM"
date=$(date +'%Y/%m')

# Run the ecosystem actors codes only from April 2023 onwards
for code in "${cu_codes[@]}"; do
  node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" "$date"
done


# Run the ecosystem actors codes only from April 2023 onwards
for code in "${ecosystem_codes[@]}"; do
  node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" "$date"
done
