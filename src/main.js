import fs from 'fs/promises';
import path from 'path';
import { load } from 'cheerio';
import LoaderError from './LoaderError.js';
import client from './vendor/httpClient.js';
import log from './vendor/logger.js';
import loadAsset from './lib/loadAsset.js';
import isLocalAsset from './lib/isLocalAsset.js';
import getName from './lib/getName.js';
import { getSource, setSource } from './lib/source.js';

const getAssetPath = (url, dirname) => {
  const { pathname } = new URL(url);
  const extension = path.extname(pathname) || '.html';
  const assetName = getName(url, extension);
  const assetPath = path.posix.join(dirname, assetName);
  return assetPath;
};

const loadPage = (pageUrl, outDir = '.') => {
  log('got page url %s and output directory', pageUrl, outDir);

  const resolvedPath = path.resolve(process.cwd(), outDir);

  const filename = getName(pageUrl, '.html');
  const dirname = getName(pageUrl, '_files');

  const filepath = path.join(resolvedPath, filename);
  const assetsPath = path.join(resolvedPath, dirname);

  let assetsUrls;

  log('loading resource from %s', pageUrl);

  const result = client.get(pageUrl)
    .then(({ data, status }) => {
      log('succeeded (%d, %s)', status, pageUrl);

      const $ = load(data);

      const $assets = $('img[src], link[href], script[src]')
        .each((_, asset) => {
          const $asset = $(asset);
          const source = getSource($asset);
          const url = new URL(source, pageUrl);
          setSource($asset, url.toString());
        })
        .filter((_, asset) => {
          const assetUrl = getSource($(asset));
          const { origin } = new URL(pageUrl);
          return isLocalAsset(assetUrl, origin);
        });

      assetsUrls = $assets
        .map((_, asset) => getSource($(asset)))
        .toArray();

      $assets.each((_, asset) => {
        const $asset = $(asset);
        const url = getSource($asset);
        const assetPath = getAssetPath(url, dirname);
        setSource($asset, assetPath);
      });

      log('saving processed html as %s', filename);

      return fs.writeFile(filepath, $.html());
    })
    .then(() => {
      log('creating assets folder (%s)', dirname);
      return fs.mkdir(assetsPath);
    })
    .then(() => Promise.all(
      assetsUrls.map((url) => loadAsset(url, assetsPath)),
    ))
    .then(() => ({ filepath }));

  return result;
};

export default (pageUrl, outDir) => new Promise((resolve) => {
  resolve(loadPage(pageUrl, outDir));
}).catch((err) => {
  throw new LoaderError(err);
});
