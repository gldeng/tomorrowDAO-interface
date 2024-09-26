/* eslint-disable @next/next/inline-script-id */
'use client';

import Script from 'next/script';

export default function VconsoleScript() {
  return (
    <Script>
      {`
        var urlObj = new URL(window.location.href);
        var utmSource = urlObj.searchParams.get('utm_source');
        var utmMedium = urlObj.searchParams.get('utm_medium');
        var utmCampaign = urlObj.searchParams.get('utm_campaign');
        var utmId = urlObj.searchParams.get('utm_id');
        var utmTerm = urlObj.searchParams.get('utm_term');
        var utmContent = urlObj.searchParams.get('utm_content');

        var campaign = {};

        if (utmId) campaign.id = utmId; 
        if (utmSource) campaign.source = utmSource;
        if (utmMedium) campaign.medium = utmMedium;
        if (utmCampaign) campaign.name = utmCampaign; 
        if (utmTerm) campaign.term = utmTerm;
        if (utmContent) campaign.content = utmContent;


        console.log('campaign params', campaign);
        if (Object.keys(campaign).length > 0) {
            gtag('set', 'campaign', campaign);
        }
        `}
    </Script>
  );
}
