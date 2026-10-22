import os
import xml.etree.ElementTree as ET

extract_dir = r'c:\Users\amanr\Abcd\pptx_extracted'
slides_dir = os.path.join(extract_dir, 'ppt', 'slides')

for i in range(1, 6):
    print(f'=================== SLIDE {i} ===================')
    tree = ET.parse(os.path.join(slides_dir, f'slide{i}.xml'))
    root = tree.getroot()
    
    # Check shapes
    for sp in root.iter('{http://schemas.openxmlformats.org/presentationml/2006/main}sp'):
        nvSpPr = sp.find('{http://schemas.openxmlformats.org/presentationml/2006/main}nvSpPr')
        name = nvSpPr.find('{http://schemas.openxmlformats.org/presentationml/2006/main}cNvPr').attrib.get('name') if nvSpPr is not None else 'unknown'
        texts = [t.text for t in sp.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t') if t.text]
        xfrm = sp.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}xfrm')
        off = xfrm.find('{http://schemas.openxmlformats.org/drawingml/2006/main}off') if xfrm is not None else None
        ext = xfrm.find('{http://schemas.openxmlformats.org/drawingml/2006/main}ext') if xfrm is not None else None
        pos = f"x={off.attrib.get('x')} y={off.attrib.get('y')} w={ext.attrib.get('cx')} h={ext.attrib.get('cy')}" if off is not None and ext is not None else ""
        print(f"Shape [{name}] {pos} -> Text: {' | '.join(texts)}")

    for pic in root.iter('{http://schemas.openxmlformats.org/presentationml/2006/main}pic'):
        nvPicPr = pic.find('{http://schemas.openxmlformats.org/presentationml/2006/main}nvPicPr')
        name = nvPicPr.find('{http://schemas.openxmlformats.org/presentationml/2006/main}cNvPr').attrib.get('name') if nvPicPr is not None else 'unknown'
        blip = pic.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
        embed = blip.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') if blip is not None else ''
        xfrm = pic.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}xfrm')
        off = xfrm.find('{http://schemas.openxmlformats.org/drawingml/2006/main}off') if xfrm is not None else None
        ext = xfrm.find('{http://schemas.openxmlformats.org/drawingml/2006/main}ext') if xfrm is not None else None
        pos = f"x={off.attrib.get('x')} y={off.attrib.get('y')} w={ext.attrib.get('cx')} h={ext.attrib.get('cy')}" if off is not None and ext is not None else ""
        print(f"Pic [{name}] {embed} {pos}")
