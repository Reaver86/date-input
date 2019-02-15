import { AppPage } from './app.po';
import { by, element } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    await page.navigateTo();
  });

  it('should only accept numbers for day', async () => {
    const input = element(by.css('input.day'));
    await input.sendKeys('aef');
    expect(await input.getAttribute('value')).toBe('');
    await input.sendKeys('+-.');
    expect(await input.getAttribute('value')).toBe('');
    await input.sendKeys('12');
    expect(await input.getAttribute('value')).toBe('12');
  });

  it('should only accept numbers for month', async () => {
    const input = element(by.css('input.month'));
    await input.sendKeys('aef');
    expect(await input.getAttribute('value')).toBe('');
    await input.sendKeys('+-.');
    expect(await input.getAttribute('value')).toBe('');
    await input.sendKeys('12');
    expect(await input.getAttribute('value')).toBe('12');
  });

  it('should only accept numbers for year', async () => {
    const input = element(by.css('input.year'));
    await input.sendKeys('aef');
    expect(await input.getAttribute('value')).toBe('');
    await input.sendKeys('+-.');
    expect(await input.getAttribute('value')).toBe('');
    await input.sendKeys('2013');
    expect(await input.getAttribute('value')).toBe('2013');
  });
});
