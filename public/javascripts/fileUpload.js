// FIlePong packkage -> handles image preview and file upload to the db. Replace multer with this
const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--ehr-cover-width-large') != null && rootStyles.getPropertyValue('--ehr-cover-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--ehr-cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--ehr-cover-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
    FilePondPluginPdfPreview
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight,
    allowPdfPreview: true,
    pdfPreviewHeight: 320,
    pdfComponentExtraParams: 'toolbar=0&view=fit&page=1'  
  })
  
  FilePond.parse(document.body)
}