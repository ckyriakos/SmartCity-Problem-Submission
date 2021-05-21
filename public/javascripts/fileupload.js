  
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
)

FilePond.setOptions({
  stylePanelAspectRatio: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
  allowPdfPreview: true,
  pdfPreviewHeight: 640,
  pdfComponentExtraParams: 'toolbar=0&view=fit&page=1'
})

FilePond.parse(document.body);