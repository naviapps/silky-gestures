import { ImageMessage, LinkMessage, Point } from '@/types';
import { defineExtensionMessaging } from '@webext-core/messaging';

export type GestureMessage = {
  gesture: string;
  targets: { gestureId: string }[];
  links: LinkMessage[];
  images: ImageMessage[];
  selection?: string;
};

export interface ProtocolMap {
  gesture(data: GestureMessage): void;
  nativeport(data: { rightclick: Point }): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
