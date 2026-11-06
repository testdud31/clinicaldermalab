import re

files_to_fix = [
    'reviews/flakes-anti-dandruff-shampoo-and-conditioner-set/index.html',
    'reviews/the-bald-brothers-scalp-moisturizer/index.html',
    'reviews/the-bald-brothers-spf-50-invisible-sunscreen-gel/index.html'
]

for fpath in files_to_fix:
    with open(fpath) as f:
        content = f.read()

    # In flakes:
    # 0 was Testing, 1 was Comparison, 2 was Formulation.
    # Convert heading 0 to Formulation, heading 1 to Testing, heading 2 to Comparison, or adjust accordingly.
    if 'flakes' in fpath:
        content = content.replace('<h2 id="testing">Biophysical Testing &amp; TEWL Metrics</h2>', '<h2 id="formulation">Biochemical Formulation Analysis</h2>', 1)
        content = content.replace('<h2 id="comparison">Head-to-Head Comparative Matrix</h2>', '<h2 id="testing">Biophysical Testing &amp; TEWL Metrics</h2>', 1)
        content = content.replace('<h2 id="formulation">Biochemical Formulation Analysis</h2>', '<h2 id="comparison">Head-to-Head Comparative Matrix</h2>', 1)

    # In bald brothers scalp moisturizer:
    # 0 was Formulation, 1 was Comparison, 2 was Testing.
    if 'scalp-moisturizer' in fpath:
        # Swap Comparison and Testing
        # Replace the first occurrence of comparison with testing
        content = content.replace('<h2 id="comparison">Head-to-Head Comparative Matrix</h2>', 'TEMP_PLACEHOLDER_COMP', 1)
        content = content.replace('<h2 id="testing">Biophysical Testing &amp; TEWL Metrics</h2>', '<h2 id="comparison">Head-to-Head Comparative Matrix</h2>', 1)
        content = content.replace('TEMP_PLACEHOLDER_COMP', '<h2 id="testing">Biophysical Testing &amp; TEWL Metrics</h2>', 1)

    # In bald brothers spf 50:
    # 0 was Testing, 1 was Formulation
    if 'spf-50' in fpath:
        content = content.replace('<h2 id="testing">Biophysical Testing &amp; TEWL Metrics</h2>', 'TEMP_PLACEHOLDER_TEST', 1)
        content = content.replace('<h2 id="formulation">Biochemical Formulation Analysis</h2>', '<h2 id="testing">Biophysical Testing &amp; TEWL Metrics</h2>', 1)
        content = content.replace('TEMP_PLACEHOLDER_TEST', '<h2 id="formulation">Biochemical Formulation Analysis</h2>', 1)

    with open(fpath, 'w') as f:
        f.write(content)
    print(f"Fixed {fpath}")

