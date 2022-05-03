import { ref } from "vue"
import FFmpeg from '@ffmpeg/ffmpeg'

const { createFFmpeg, fetchFile } = FFmpeg
const ffmpeg = createFFmpeg({ log: false })

export default function useFFmpeg() {
    const isReady = ref(false)
    const isConverting = ref(false)
    const output = ref(null)
    const isSupported = ref(true)

    const imageFormats = [
        { format: 'PPM', mimeType: 'image/x-portable-pixmap	' },
        { format: 'GIF', mimeType: 'image/gif' },
        { format: 'ICO', mimeType: 'image/x-icon' },
        { format: 'BMP', mimeType: 'image/bmp' },
        { format: 'JPEG', mimeType: 'image/jpeg	' },
        { format: 'MSP', mimeType: 'application/octet-stream' },
        { format: 'PNG', mimeType: 'image/png' },
        { format: 'PSD', mimeType: 'image/vnd.adobe.photoshop' },
        { format: 'RAS', mimeType: 'image/x-cmu-raster' },
        { format: 'TIFF', mimeType: 'image/tiff	' },
    ]

    const videoFormats = [
        { format: 'HEVC', mimeType: 'video/mp4' },
        { format: 'WEBM', mimeType: 'video/webm' },
        { format: 'OGG', mimeType: 'video/ogg' },
        { format: 'MP4', mimeType: 'video/mp4' },
        { format: 'AVI', mimeType: 'video/x-msvideo' },
        { format: 'WMV', mimeType: 'video/x-ms-wmv' },
        { format: 'MOV', mimeType: 'video/quicktime' },
        { format: 'FLV', mimeType: 'video/x-flv' },
    ]
    
    const load = async () => {
        try {
            await ffmpeg.load()
            isReady.value = true
        } catch (e) {
            console.log(e)
            isSupported.value = false
        }
    }

    load()

    const convertToFormat = async (inputFile, format) => {
        isConverting.value = true
        const tempFileOutputName = [Date.now(), format.format].join('.')
        ffmpeg.FS('writeFile', inputFile.name, await fetchFile(inputFile))
        await ffmpeg.run('-i', inputFile.name, tempFileOutputName)
  
        const data = ffmpeg.FS('readFile', tempFileOutputName)
  
        output.value = URL.createObjectURL(new Blob([data.buffer]), { type: format.mimeType })
        isConverting.value = false
    }

    return {
        isReady,
        convertToFormat,
        output,
        isConverting,
        isSupported,
        imageFormats,
        videoFormats,
    }
}