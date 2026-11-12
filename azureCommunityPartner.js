const communityPartnerMarkup = `
<div class="associate-partner-showcase">
  <article aria-label="Azure Developer Community associate partner" class="associate-partner-card">
    <div class="partner-tier-heading">
      <span class="partner-tier-tag">ASSOCIATE PARTNER</span>
      <h3>Azure Developer Community</h3>
    </div>
    <div class="partner-banner-frame">
      <img alt="Supported by Microsoft Azure and Azure Developer Community" class="azure-community-partner-banner" decoding="async" height="233" loading="lazy" src="assets/azure-developer-community-banner.jpg" width="1396"/>
    </div>
  </article>

  <div class="sub-partners-grid">
    <article aria-label="Networking partners" class="networking-partner-card">
      <div class="partner-tier-heading">
        <span class="partner-tier-tag">NETWORKING PARTNERS</span>
        <h3>Community &amp; Social Impact</h3>
      </div>
      <div class="networking-partner-list">
        <div aria-label="Girl Up Change" class="networking-partner-item">
          <div class="partner-logo-tile">
            <img alt="Girl Up Change logo" class="community-partner-logo" decoding="async" height="768" loading="lazy" src="assets/girl-up-change.png" width="768"/>
          </div>
          <span class="networking-partner-name">Girl Up Change</span>
        </div>
        <div aria-label="Masika Care Private Limited" class="networking-partner-item">
          <div class="partner-logo-tile">
            <img alt="Masika Care logo" class="community-partner-logo" decoding="async" height="768" loading="lazy" src="assets/logo-masika-care.png" width="768"/>
          </div>
          <span class="networking-partner-name">Masika Care</span>
        </div>
      </div>
    </article>

    <article aria-label="AI4Tomorrow community partner" class="community-partner-card">
      <div class="partner-tier-heading">
        <span class="partner-tier-tag">COMMUNITY PARTNER</span>
        <h3>AI4Tomorrow</h3>
      </div>
      <div class="partner-logo-tile community-partner-tile">
        <img alt="AI4Tomorrow logo" class="community-partner-logo" decoding="async" height="768" loading="lazy" src="assets/ai4tomorrow.png" width="768"/>
      </div>
    </article>
  </div>
</div>`;

export function withCommunityPartners(markup) {
  const customSlot = '<div id="community-partners-slot"></div>';
  if (markup.includes(customSlot)) {
    return markup.replace(customSlot, communityPartnerMarkup);
  }

  const fallbackPoint = '<article class="co-title-sponsor-card">';
  if (markup.includes(fallbackPoint)) {
    return markup.replace(fallbackPoint, `${communityPartnerMarkup}\n${fallbackPoint}`);
  }

  return markup;
}
