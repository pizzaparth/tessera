import React from 'react';
import { Robot } from '../landing/atlas/Robot';

/** "You" avatar from the landing page threads. */
export const UserAvatar: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <div
    className="shrink-0 rounded-lg bg-gradient-to-br from-[#ffd6a5] to-[#ff9fb2] flex items-center justify-center font-semibold text-black/70"
    style={{ width: size, height: size, fontSize: size * 0.36 }}
    aria-hidden="true"
  >
    You
  </div>
);

/** Vault AI avatar: the landing page robot, cropped to its head. */
export const AgentAvatar: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <div
    className="shrink-0 rounded-lg bg-[#0b1f45] overflow-hidden flex items-center justify-center"
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <Robot awake track={false} crop="head" className="w-[88%] h-[88%]" />
  </div>
);

/** Brain Vault mark used in the landing page nav. */
export const VaultLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    <circle cx="18" cy="5" r="3" fill="currentColor" />
    <circle cx="6" cy="12" r="3" fill="currentColor" />
    <circle cx="18" cy="19" r="3" fill="currentColor" />
  </svg>
);
