const azureCommunityPartnerMarkup = `
<article aria-label="Azure Developer Community associate partner" class="azure-community-partner-card">
  <div class="azure-community-partner-heading">
    <span>ASSOCIATE PARTNER</span>
    <h3>Azure Developer Community</h3>
  </div>
  <img alt="Supported by Microsoft Azure and Azure Developer Community" class="azure-community-partner-banner" decoding="async" height="233" loading="lazy" src="assets/azure-developer-community-banner.jpg" width="1396"/>
</article>`;

export function withAzureCommunityPartner(markup) {
  const insertionPoint = '<article class="co-title-sponsor-card">';
  if (!markup.includes(insertionPoint)) {
    throw new Error('Could not find the sponsor section insertion point for the Azure Developer Community partner.');
  }

  return markup.replace(insertionPoint, `${azureCommunityPartnerMarkup}\n${insertionPoint}`);
}
