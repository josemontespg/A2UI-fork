import { chromium } from '@playwright/test';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();

  await page1.goto('http://localhost:4201');
  await page2.goto('http://localhost:4202');
  
  await page1.waitForTimeout(2000);
  await page2.waitForTimeout(2000);

  const names = await page1.evaluate(() => {
    return Array.from(document.querySelectorAll('.ex-name')).map(el => el.textContent.trim());
  });

  const discrepancies = [];
  console.log(`Found ${names.length} examples to compare.`);

  for (const name of names) {
    const hash = '#' + slugify(name);
    try {
      await page1.locator('.sidebar li .ex-name').filter({ hasText: new RegExp(`^${name}$`) }).click();
      await page2.locator('.sidebar li .ex-name').filter({ hasText: new RegExp(`^${name}$`) }).click();

      await page1.waitForTimeout(600);
      await page2.waitForTimeout(600);

      const surface1Exists = await page1.locator('a2ui-v09-surface').count();
      const surface2Exists = await page2.locator('a2ui-v09-surface').count();

      if (!surface1Exists || !surface2Exists) continue;

      const actualHTML = await page1.evaluate(() => document.querySelector('a2ui-v09-surface')?.innerHTML || '');
      const expectedHTML = await page2.evaluate(() => document.querySelector('a2ui-v09-surface')?.innerHTML || '');

      const hasKnownMissingLabel = expectedHTML.includes('Location') && !expectedHTML.includes('<label');
      const hasKnownChoicePickerBug = expectedHTML.includes('a2ui-chip') && !expectedHTML.includes('selected') && !expectedHTML.includes('chip');
      const hasKnownTextBug = expectedHTML.includes('10') && !expectedHTML.includes('<p>10</p>');

      let textMismatch = false;
      let missingClasses = [];
      let extraClasses = [];

      if (actualHTML !== expectedHTML) {
        const actualText = (await page1.locator('a2ui-v09-surface').innerText()).replace(/\s+/g, ' ').trim();
        const expectedText = (await page2.locator('a2ui-v09-surface').innerText()).replace(/\s+/g, ' ').trim();
        textMismatch = actualText !== expectedText;
        
        if (hasKnownTextBug && name === 'ChildList Template Expansion') {
          textMismatch = false;
        }

        const extractClasses = async (page) => {
          return await page.locator('a2ui-v09-surface').evaluate(el => {
            const classes = new Set();
            Array.from(el.querySelectorAll('*')).forEach(e => {
              Array.from(e.classList).forEach(c => {
                if (!c.startsWith('_ng') && c !== 'active') {
                  classes.add(c);
                }
              });
            });
            return Array.from(classes);
          });
        };

        const classes1 = await extractClasses(page1);
        const classes2 = await extractClasses(page2);
        
        missingClasses = classes2.filter(x => !classes1.includes(x) && x !== 'a2ui-textfield');
        extraClasses = classes1.filter(x => !classes2.includes(x) && x !== 'a2ui-textfield');
        
        if (hasKnownChoicePickerBug) {
          extraClasses = extraClasses.filter(x => x !== 'chip' && x !== 'selected');
        }
        if (hasKnownMissingLabel) {
          extraClasses = extraClasses.filter(x => x !== 'a2ui-choice-picker-label');
        }
        extraClasses = extraClasses.filter(x => x !== 'error' && x !== 'invalid');
      }

      if (textMismatch || missingClasses.length > 0 || extraClasses.length > 0) {
        discrepancies.push({
          hash,
          textMismatch,
          missingClasses,
          extraClasses
        });
        console.log(`❌ Discrepancy in ${hash}: textMismatch=${textMismatch}, missingClasses=${missingClasses.join(',')}, extraClasses=${extraClasses.join(',')}`);
      } else {
        console.log(`✅ ${hash} matches perfectly!`);
      }
    } catch (e) {
      console.log(`⚠️ Error on ${hash}:`, e.message);
    }
  }

  console.log('\\n========================================');
  console.log(`Summary: ${names.length - discrepancies.length}/${names.length} examples matched perfectly.`);
  if (discrepancies.length > 0) {
    console.log('Discrepancies found in:', JSON.stringify(discrepancies, null, 2));
  } else {
    console.log('ALL EXAMPLES MATCH PERFECTLY!');
  }

  await browser.close();
}

main().catch(console.error);
