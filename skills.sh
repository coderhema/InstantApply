#!/bin/bash

# Agent Skills Database
# This file defines the core capabilities of the IAAI Agent

SKILLS=(
  "React.js"
  "TypeScript"
  "Tailwind CSS"
  "Gemini API"
  "UI/UX Design"
  "Automated Drafting"
  "Job Matching"
  "Resume Optimization"
)

echo "Loading agent skills..."
for skill in "${SKILLS[@]}"; do
  echo " - $skill"
done
