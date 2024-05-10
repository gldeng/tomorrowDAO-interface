import React from 'react';
export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="lg:mx-auto bg-white rounded-lg border border-solid border-Neutral-Divider mb-16">
      <div className="px-4 lg:px-8">{children}</div>
    </section>
  );
}
