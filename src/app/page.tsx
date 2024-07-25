'use client';
import React, { useEffect } from 'react';
import { Button } from 'aelf-design';
import { RightOutlined } from '@ant-design/icons';
import './home.css';
import Link from 'next/link';
import breadCrumb from 'utils/breadCrumb';

export default function Page() {
  useEffect(() => {
    breadCrumb.clearBreadCrumb();
  }, []);
  return (
    <div className="dao-home-container">
      <div className="intro-feature-wrap">
        <div className="dao-home-intro">
          <h2>Unleash the power of collective action.</h2>
          <p>Build your DAO with TMRWDAO.</p>
          <div className="flex">
            <Link href="/explore">
              <Button type="primary" className="w-[152px]">
                Explore
              </Button>
            </Link>
            <Link href="/create">
              <Button className="ml-[24px] w-[152px]">Create a DAO</Button>
            </Link>
          </div>
        </div>
        <div className="feature-cards">
          <div className="network-dao-feature-wrap">
            <div className="mask"></div>
            <div className="network-dao-feature">
              {/* <div className="mask"></div> */}
              <div className="flex items-center">
                <img width={32} height={32} src="/images/network-dao.png" alt="" />
                <h3 className="dao-title">Network DAO</h3>
              </div>
              <div className="skeleton-1"></div>
              <div className="skeleton-2"></div>
            </div>
          </div>
          <div className="total-votes-feature">
            <div className="flex items-center">
              <h2 className="emoji">
                <span className="text">😊</span>
              </h2>
              <div className="skeleton-wrap">
                <div className="skeleton-1"></div>
                <div className="skeleton-2"></div>
              </div>
            </div>
            <div className="flex justify-between">
              <h2 className="title">Total 100 votes</h2>
              <img src="/images/person.png" alt="" className="w-[76] h-[21px]" />
            </div>
          </div>
          <div className="voting-result-feature">
            <h2 className="title">Voting Results</h2>
            <div className="progress-item">
              <div className="skeleton skeleton-1"></div>80%
            </div>
            <div className="progress-item">
              <div className="skeleton skeleton-2"></div>12%
            </div>
            <div className="progress-item">
              <div className="skeleton skeleton-3"></div>8%
            </div>
          </div>
          <div className="future-mind-feature-wrap">
            <div className="future-mind-feature">
              <div className="flex items-center">
                <img width={32} height={32} src="/images/future-mind.png" alt="" />
                <h2 className="dao-title">FutureMind</h2>
              </div>
              <div className="skeleton-1"></div>
              <div className="skeleton-2"></div>
              <div className="skeleton-3"></div>
            </div>
            <div className="mask"></div>
          </div>
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="star">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="70"
              viewBox="0 0 56 70"
              fill="none"
            >
              <path
                d="M9.60261 34.3672L10.4332 42.3963C10.6576 44.5656 12.3264 46.3054 14.4844 46.62L19.13 47.2972L14.4606 47.978C12.3137 48.2909 10.6494 50.0151 10.4126 52.1718L9.60261 59.5468L8.79262 52.1718C8.55576 50.0151 6.89153 48.2909 4.74459 47.978L0.0751953 47.2972L4.72077 46.62C6.87878 46.3054 8.54759 44.5656 8.772 42.3963L9.60261 34.3672Z"
                fill="#FA9D2B"
              />
              <path
                d="M32.0606 43.8945L32.8912 51.9237C33.1156 54.0929 34.7844 55.8327 36.9424 56.1473L41.588 56.8246L36.9186 57.5053C34.7717 57.8183 33.1075 59.5425 32.8706 61.6991L32.0606 69.0741L31.2506 61.6991C31.0138 59.5425 29.3495 57.8183 27.2026 57.5053L22.5332 56.8246L27.1788 56.1473C29.3368 55.8327 31.0056 54.0929 31.23 51.9237L32.0606 43.8945Z"
                fill="#FA9D2B"
              />
              <path
                d="M38.8651 0L40.3018 13.8882C40.69 17.6404 43.5766 20.6499 47.3093 21.1941L55.3449 22.3655L47.2681 23.543C43.5545 24.0843 40.6759 27.0667 40.2661 30.7971L38.8651 43.5539L37.4641 30.7971C37.0543 27.0667 34.1757 24.0843 30.462 23.543L22.3853 22.3655L30.4209 21.1941C34.1536 20.6499 37.0402 17.6404 37.4284 13.8882L38.8651 0Z"
                fill="#FA9D2B"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="help-wrap">
        <ul className="dao-desc-items">
          <li className="dao-desc-items-card">
            <h3>Create a DAO</h3>
            <p>
              Create your DAO, where you can initiate proposals and let other members vote to
              co-build your community.
            </p>
            <Link
              target="_blank"
              href={
                'https://medium.com/@tmrwdao/how-to-create-a-dao-on-tmrwdao-platform-cc54fed69259'
              }
            >
              <div className="text-colorPrimary flex items-center mt-[24px] text-[16px] leading-[24px]">
                <span className="pr-[8px]">Learn More</span> <RightOutlined />
              </div>
            </Link>
          </li>
          <li className="dao-desc-items-card dao-desc-items-card-last">
            <h3>Elect High Council</h3>
            <p>
              Run for High Council, and you will become a core member of the DAO with more
              privileges.
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
            <Link
              target="_blank"
              href={
                'https://medium.com/@tmrwdao/how-to-enable-and-manage-a-dao-treasury-with-tmrwdao-ead8168d4c9a'
              }
            >
              <div className="text-colorPrimary flex items-center mt-[16px] text-[16px] font-medium leading-[22px]">
                <span className="pr-[8px] text-[14px]">Learn More</span> <RightOutlined />
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="feature-wrap">
        <h2>Flexible structures for different DAO types</h2>
        <ul className="feature-wrap-items">
          <li className="dao-desc-items-card">
            <h3 className="mb-[80px]">Multisig-based DAO </h3>
            <p>
              A &quot;multisig&quot; is a shared wallet, typically with two or more members
              authorizing transactions.
            </p>
            <Link target="_blank" href="/create">
              <Button type="primary" className="mt-[24px]">
                Create a Multisig-based DAO
              </Button>
            </Link>
          </li>
          <li className="dao-desc-items-card dao-desc-items-card-last">
            <h3>Token-based DAO </h3>
            <p>
              Users who hold governance tokens can participate in the DAO&apos;s governance by
              voting on proposals.
            </p>
            <Link target="_blank" href="/create">
              <Button type="primary" className="mt-[24px]">
                Create a Token-based DAO
              </Button>
            </Link>
          </li>
        </ul>
      </div>
      <div className="image-feature-wrap">
        <h2>Transparent Governance Starts Here</h2>
        <ul className="image-feature-items-wrap">
          <li className="image-feature-item">
            <div className="text-wrap">
              <p className="tag">STEP 1</p>
              <h3 className="title">Select a type of DAO you want to create</h3>
              <p className="desc">
                Select an issued token or NFT as the governance token, or choose some users as DAO
                members.
              </p>
            </div>
            <img width={500} height={500} src="/images/treasury-1.png" alt="" />
          </li>
          <li className="image-feature-item">
            <img width={500} height={500} src="/images/treasury-2.png" alt="" />
            <div className="text-wrap">
              <p className="tag">STEP 2</p>
              <h3 className="title">Govern through proposals</h3>
              <p className="desc">
                After creating a proposal, use tokens, NFTs, or become a DAO member to vote.
              </p>
            </div>
          </li>
          <li className="image-feature-item">
            <div className="text-wrap">
              <p className="tag">STEP 3</p>
              <h3 className="title">Fund and allocate the treasury</h3>
              <p className="desc">
                Deposit funds to your DAO&apos;s treasury and govern your DAO by allocating these
                funds.
              </p>
            </div>
            <img width={500} height={500} src="/images/treasury-3.png" alt="" />
          </li>
        </ul>
      </div>
      <div className="feature-wrap">
        <h2>Al-powered DAO infrastructure</h2>
        <ul className="feature-wrap-items">
          <li className="dao-desc-items-card">
            <h3 className="mb-[80px]">Al agents in DAO governance </h3>
            <p>
              Writing proposals, white papers, manifestos and posts Summarizing governance decisions
              Onboarding new members (on-chain reputation or storing of credentials)
            </p>
          </li>
          <li className="dao-desc-items-card dao-desc-items-card-last">
            <h3>Al-assisted data analysis</h3>
            <p>
              Providing analysis and insights on proposals Using data analytics to identify patterns
              of behavior or voting trends among members. This helps the DAO to make informed
              decisions about proposals or changes to its governance structure.
            </p>
          </li>
        </ul>
      </div>
      <div className="image-feature-wrap !mb-[148px]">
        <h2>And more</h2>
        <ul className="image-feature-items-wrap">
          <li className="image-feature-item">
            <img width={500} height={500} src="/images/ai-logo.png" alt="" />
            <div className="text-wrap">
              <h3 className="title">Swarm Intelligence</h3>
              <p className="desc">
                Al agents can serve as connections, or liaisons, between DAOs, forming a kind of
                &quot;swarm intelligence&quot; of agents or DAOs, that can work together without the
                need for human facilitation.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
