"""Audit supplied CSV transcriptions against extracted supplementary PDF tables.
Requires pdftotext; run with --input-dir pointing to the seven supplied files.
The PDFs are read locally and are not copied into the repository or Pages.
"""
import argparse,csv,hashlib,json,re,subprocess,tempfile
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('--input-dir',required=True);parser.add_argument('--write',action='store_true');args=parser.parse_args()
root=Path(args.input_dir)
files=sorted(root.iterdir())
def pick(suffix):
 hits=[p for p in files if p.name.endswith(suffix)]
 if len(hits)!=1:raise ValueError(f'Expected one file ending {suffix}')
 return hits[0]
supp=pick('brew_temperature_SUPPLEMENTARY.pdf');s1file=pick('S1_brewing_parameters.csv');s5file=pick('S5_attribute_intensities.csv')
with tempfile.TemporaryDirectory() as tmp:
 output=Path(tmp)/'supp.txt';subprocess.run(['pdftotext','-layout',str(supp),str(output)],check=True);pdf=output.read_text()
s1=list(csv.DictReader(s1file.open(encoding='utf-8')));s5=list(csv.DictReader(s5file.open(encoding='utf-8')))
pdf1=[line.split() for line in pdf.splitlines() if re.match(r'^\s*1\.(00|25|50)\s+(16|20|24)\s+(87|90|93)\s',line)]
assert len(s1)==len(pdf1)==27
normalize=lambda text:re.sub(r'\s+','',text)
mismatches=[]
for i,(row,tokens) in enumerate(zip(s1,pdf1)):
 cells=tokens[:11]+[' '.join(tokens[11:14]),' '.join(tokens[14:17])]
 assert len(cells)==len(row)==13
 for field,actual in zip(row,cells):
  if normalize(row[field])!=normalize(actual):mismatches.append({'table':'S1','row':i,'field':field,'csv':row[field],'pdf':actual})
section=pdf[pdf.index('Total Dissolved Solids       Percent Extraction'):].split('Supplementary Table S5.')[0]
intensity_cells=0
for row in s5:
 line=next((x for x in section.splitlines() if re.sub(r'\s+',' ',x.strip()).startswith(row['Attribute']+' ')),None)
 if line is None:raise ValueError('Missing S5 PDF row '+row['Attribute'])
 cells=re.findall(r'\d+(?:\.\d+)?[abc]?',line);expected=list(row.values())[1:]
 if expected[-1]=='':expected=expected[:-1]
 if cells!=expected:mismatches.append({'table':'S5','attribute':row['Attribute'],'csv':expected,'pdf':cells})
 intensity_cells+=len(cells)
report={'reviewDate':'2026-10-23','provenance':'user_supplied_files_not_independently_fetched_from_publisher','doi':'10.1038/s41598-020-73341-4','csvToPdfAudit':{'S1_rows':len(s1),'S1_cells_compared':len(s1)*13,'S5_attributes':len(s5),'S5_numeric_cells_compared_including_letter_codes':intensity_cells,'mismatches':mismatches},'dataLimits':{'individual_panel_ratings_supplied':False,'per_brew_raw_measurements_supplied':False,'joint_27_condition_sensory_table_supplied':False,'S5_is_marginal_means':True,'automatic_training_performed':False},'fileManifest':[{'file':p.name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files if p.suffix.lower() in ['.pdf','.csv']]}
if mismatches:raise ValueError(json.dumps(mismatches,ensure_ascii=False))
if args.write:Path('docs/evidence/2020-temperature-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report['csvToPdfAudit'],ensure_ascii=False,indent=2))
