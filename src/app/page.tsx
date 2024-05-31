'use client';
import React from 'react';
import { Button } from 'aelf-design';
import './home.css';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="dao-home-container">
      <div className="dao-home-intro">
        <h2>Unleash the power of collective action.</h2>
        <p>Build your DAO with TMRWDAO.</p>
        <div className="flex">
          <Link href="/explore">
            <Button className="w-[152px]">Explore</Button>
          </Link>
          <Link href="/guide">
            <Button type="primary" className="ml-[24px] w-[152px]">
              Create a DAO
            </Button>
          </Link>
        </div>
      </div>
      <ul className="dao-desc-items">
        <li className="dao-desc-items-card">
          <h3>Create a DAO</h3>
          <p>
            Create your DAO, where you can initiate proposals and let other members vote to co-build
            your community.
          </p>
        </li>
        <li className="dao-desc-items-card dao-desc-items-card-last">
          <h3>Elect High Council</h3>
          <p>
            Run for High Council, and you will become a core member of the DAO with more privileges.
          </p>
        </li>
      </ul>
      <ul className="dao-desc-items">
        <li className="dao-desc-items-card">
          <h3>Create Proposals </h3>
          <p>
            Create proposals to governance your DAO, authorized use of treasury assets and much
            more.
          </p>
        </li>
        <li className="dao-desc-items-card dao-desc-items-card-last">
          <h3>Treasury Governance </h3>
          <p>Donate assets to the treasury, which can be used for community development.</p>
        </li>
      </ul>
    </div>
  );
}
