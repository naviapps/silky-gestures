import { LinkMessage } from '@/types';
import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
  stop(): void;
  gotoTop(): void;
  gotoBottom(): void;
  pageUp(): void;
  pageDown(): void;
  pageNext(): void;
  pagePrevious(): void;
  showCookies(): void;
  print(): void;
  copy(selection: string): void;
  copyLink(links: LinkMessage[]): void;
}

export const { sendMessage, onMessage, removeAllListeners } = defineExtensionMessaging<ProtocolMap>();
