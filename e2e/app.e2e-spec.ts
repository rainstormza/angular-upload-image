import { UploadImagePage } from './app.po';

describe('upload-image App', () => {
  let page: UploadImagePage;

  beforeEach(() => {
    page = new UploadImagePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
