const communityPartnerMarkup = `
<article aria-label="Azure Developer Community associate partner" class="azure-community-partner-card">
  <div class="azure-community-partner-heading">
    <span>ASSOCIATE PARTNER</span>
    <h3>Azure Developer Community</h3>
  </div>
  <img alt="Supported by Microsoft Azure and Azure Developer Community" class="azure-community-partner-banner" decoding="async" height="233" loading="lazy" src="assets/azure-developer-community-banner.jpg" width="1396"/>
</article>
<article aria-label="Girl Up Change networking partner" class="azure-community-partner-card">
  <div class="azure-community-partner-heading">
    <span>NETWORKING PARTNER</span>
    <h3>Girl Up Change</h3>
  </div>
  <img alt="Girl Up Change logo" class="community-partner-logo" decoding="async" height="768" loading="lazy" src="assets/girl-up-change.png" width="768"/>
</article>
<article aria-label="AI4Tomorrow community partner" class="azure-community-partner-card">
  <div class="azure-community-partner-heading">
    <span>COMMUNITY PARTNER</span>
    <h3>AI4Tomorrow</h3>
  </div>
  <img alt="AI4Tomorrow logo" class="community-partner-logo" decoding="async" height="768" loading="lazy" src="assets/ai4tomorrow.png" width="768"/>
</article>`;

export function withCommunityPartners(markup) {
  const insertionPoint = '<article class="co-title-sponsor-card">';
  if (!markup.includes(insertionPoint)) {
    throw new Error('Could not find the sponsor section insertion point for the community partners.');
  }

  return markup.replace(insertionPoint, `${communityPartnerMarkup}\n${insertionPoint}`);
}
