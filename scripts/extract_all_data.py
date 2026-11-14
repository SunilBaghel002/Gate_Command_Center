# Extraction script for GATE CSE 2027
import fitz, re, json, os

doc = fitz.open('resources/GATE-CSE-2027-90-Day-Rescue-Plan.pdf')
print('Loaded PDF successfully with', len(doc), 'pages')
