// @ts-ignore
import FileIcons from '@ineo6/file-icons';
import extStore from '@/common/core.storage';
import { DICT, shareClassName, STORE } from '@/common/core.constants';

export async function whichSite() {
  const currentUrl = `${window.location.host}`;

  const sites = {
    async isGitLab() {
      const customDomains = await extStore.get(STORE.GITLAB_ENTERPRICE_URLS);

      const domainArr = customDomains ? customDomains.split('\n') : [];

      const urls = ['gitlab.com'].concat(domainArr.map((item: string) => item.replace(/https?:\/\//, '')));

      return urls.indexOf(currentUrl) >= 0;
    },
    async isOsChina() {
      const customDomains = await extStore.get(STORE.GITEE_ENTERPRICE_URLS);

      const domainArr = customDomains ? customDomains.split('\n') : [];

      const urls = ['git.oschina.net', 'gitee.com'].concat(domainArr.map((item: string) => item.replace(/https?:\/\//, '')));

      return urls.indexOf(currentUrl) >= 0;
    },
    async isGitHub() {
      const customDomains = await extStore.get(STORE.GITHUB_ENTERPRICE_URLS);

      const domainArr = customDomains ? customDomains.split('\n') : [];

      const urls = ['github.com'].concat(domainArr.map((item: string) => item.replace(/https?:\/\//, '')));

      return urls.indexOf(currentUrl) >= 0;
    },
    async isGitea() {
      const customDomains = await extStore.get(STORE.GITEA_ENTERPRICE_URLS);

      const domainArr = customDomains ? customDomains.split('\n') : [];

      const urls = ['try.gitea.io'].concat(domainArr.map((item: string) => item.replace(/https?:\/\//, '')));

      return urls.indexOf(currentUrl) >= 0;
    },
    async isGist() {
      const urls = ['gist.github.com'];

      return urls.indexOf(currentUrl) >= 0;
    },
    async isGogs() {
      const customDomains = await extStore.get(STORE.GOGS_ENTERPRICE_URLS);

      const domainArr = customDomains ? customDomains.split('\n') : [];

      const urls = ['try.gogs.io'].concat(domainArr.map((item: string) => item.replace(/https?:\/\//, '')));

      return urls.indexOf(currentUrl) >= 0;
    },
  };

  const isGitLab = await sites.isGitLab();
  const isOsChina = await sites.isOsChina();
  const isGitHub = await sites.isGitHub();
  const isGitea = await sites.isGitea();
  const isGist = await sites.isGist();
  const isGogs = await sites.isGogs();

  if (isGitLab) {
    return DICT.GITLAB;
  } else if (isGitHub) {
    return DICT.GITHUB;
  } else if (isOsChina) {
    return DICT.OSCHINA;
  } else if (isGitea) {
    return DICT.GITEA;
  } else if (isGist) {
    return DICT.GIST;
  } else if (isGogs) {
    return DICT.GOGS;
  }

  return '';
}

export const inSystemDarkMode = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

let subscribeDarkCloseFunction: any;

export const subscribeDarkMode = (cb: (prefersDarkMode: any) => void) => {
  let media = window.matchMedia('(prefers-color-scheme: dark)');
  let callback = function(e: { matches: any }) {
    let prefersDarkMode = e.matches;

    cb && cb(prefersDarkMode);
  };

  media.addEventListener('change', callback);

  subscribeDarkCloseFunction = function() {
    media.removeEventListener('change', callback);
  };
};

export const unSubscribeDarkMode = () => {
  subscribeDarkCloseFunction && subscribeDarkCloseFunction();

  subscribeDarkCloseFunction = null;
};

export const subscribeDarkModeAndChange = () => {
  if (!subscribeDarkCloseFunction) {
    subscribeDarkMode(function(isDark) {
      if (isDark) {
        $('html').addClass(shareClassName.sidebarDarkCls);
      } else {
        $('html').removeClass(shareClassName.sidebarDarkCls);
      }
    });
  }
};

const isGitHubDarkTheme = (theme: string) => {
  return theme.indexOf('dark') >= 0;
};

export const isGitHubInDark = () => {
  const dataSet = document.documentElement.dataset;

  if (dataSet && dataSet.colorMode) {
    const isDarkTheme = inSystemDarkMode();

    if (isGitHubDarkTheme(dataSet.colorMode)) {
      return true;
    }

    const githubTheme = dataSet[`${isDarkTheme ? 'dark' : 'light'}Theme`] || '';

    return isGitHubDarkTheme(dataSet.colorMode) || (dataSet.colorMode === 'auto' && isGitHubDarkTheme(githubTheme));
  }

  return false;
};

export async function getFileIcon(fileName: string) {
  if (await extStore.get(STORE.ICONS)) {
    const className = FileIcons.getClass(fileName);
    return className || 'default-icon';
  } else {
    return 'default-icon';
  }
}

export function copyElementContent(element: Element): boolean {
  let selection = window.getSelection();

  if (selection) selection.removeAllRanges();

  const range = document.createRange();
  range.selectNode(element);
  selection = window.getSelection();

  if (selection) selection.addRange(range);
  const isCopySuccessful = document.execCommand('copy');
  selection = window.getSelection();

  if (selection) selection.removeAllRanges();
  return isCopySuccessful;
}
