'use client';

import Script from 'next/script';

export default function VconsoleScript() {
  return (
    <>
      <script src="https://unpkg.com/vconsole@3.15.1/dist/vconsole.min.js"></script>
      <script>new window.VConsole();</script>
    </>
  );
}
