type Props = { pdfUrl: string }

const PdfViewer = ({ pdfUrl }: Props) => {
  return (
    <div className='h-full w-full bg-[#0a0a0a] border-l border-gray-800/50'>
      <iframe
        className='h-full w-full rounded-lg'
        src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
      ></iframe>
    </div>
  )
}

export default PdfViewer