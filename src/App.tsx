import { useState, useRef, ChangeEvent } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { FiDownload, FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
import toast, { Toaster } from 'react-hot-toast'
import { QRCodeOptions, PresetStyle, ErrorCorrectionLevel } from './types'

const presetStyles: PresetStyle[] = [
  { name: 'Classic', bgColor: '#FFFFFF', fgColor: '#000000', icon: '⚫', color: 'white' },
  { name: 'Ocean', bgColor: '#E0F2FE', fgColor: '#0C4A6E', icon: '🌊', color: 'white'  },
  { name: 'Forest', bgColor: '#D1FAE5', fgColor: '#064E3B', icon: '🌲', color: 'white'  },
  { name: 'Sunset', bgColor: '#FEE2E2', fgColor: '#7F1D1D', icon: '🌅' , color: 'white' },
  { name: 'Night', bgColor: '#1E293B', fgColor: '#E2E8F0', icon: '🌙', color: 'black'  },
  { name: 'Purple', bgColor: '#EDE9FE', fgColor: '#4C1D95', icon: '💜' , color: 'white' },
]

function App() {
  const [text, setText] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const qrRef = useRef<HTMLDivElement>(null)
  
  // QR Code options
  const [options, setOptions] = useState<QRCodeOptions>({
    size: 300,
    level: 'M',
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    includeMargin: true,
    marginSize: 4,
  })

  // Handle text input change
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  // Handle option changes
  const updateOption = <K extends keyof QRCodeOptions>(
    key: K,
    value: QRCodeOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  // Apply preset style
  const applyPreset = (preset: PresetStyle) => {
    setOptions(prev => ({
      ...prev,
      bgColor: preset.bgColor,
      fgColor: preset.fgColor,
    }))
    toast.success(`Applied ${preset.name} style!`)
  }

  // Download QR Code
  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) {
      toast.error('No QR code to download')
      return
    }
    
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = url
    link.click()
    toast.success('QR Code downloaded!')
  }

  // Copy QR Code to clipboard
  const copyToClipboard = async () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) {
      toast.error('No QR code to copy')
      return
    }
    
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      })
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Copy not supported in this browser')
    }
  }

  // Reset to defaults
  const resetOptions = () => {
    setOptions({
      size: 300,
      level: 'M',
      bgColor: '#FFFFFF',
      fgColor: '#000000',
      includeMargin: true,
      marginSize: 4,
    })
    setText('')
    toast.success('Reset to defaults')
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-10 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
            <HiSparkles className="text-blue-500" />
            QR Code Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Create beautiful QR codes with custom styles
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Text Input */}
            <div className="glass-effect rounded-xl p-6 shadow-lg fade-in">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content to encode
              </label>
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter text, URL, email, phone number, or any content..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                rows={4}
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {text.length} characters
                </p>
                <button
                  onClick={resetOptions}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <FiRefreshCw size={12} />
                  Reset all
                </button>
              </div>
            </div>

            {/* Preset Styles */}
            <div className="glass-effect rounded-xl p-6 shadow-lg fade-in">
              <h3 className="font-semibold text-gray-700 mb-4">Quick Styles</h3>
              <div className="grid grid-cols-3 gap-2">
                {presetStyles.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="p-3 rounded-lg border border-gray-200 hover:border-blue-400 transition-all text-sm flex flex-col items-center gap-1"
                    style={{
                      background: `linear-gradient(135deg, ${preset.bgColor} 50%, ${preset.fgColor} 50%)`,
                    }}
                  >
                    <span className="text-2xl">{preset.icon}</span>
                    <span className={`text-xs font-medium text-gray-700  text-${preset.color}`}>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Options */}
            <div className="glass-effect rounded-xl p-6 shadow-lg fade-in">
              <h3 className="font-semibold text-gray-700 mb-4">Customize</h3>
              
              <div className="space-y-4">
                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Size: {options.size}px
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="500"
                    step="10"
                    value={options.size}
                    onChange={(e) => updateOption('size', parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>200px</span>
                    <span>500px</span>
                  </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Foreground Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={options.fgColor}
                        onChange={(e) => updateOption('fgColor', e.target.value)}
                        className="h-10 w-20 rounded cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={options.fgColor}
                        onChange={(e) => updateOption('fgColor', e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={options.bgColor}
                        onChange={(e) => updateOption('bgColor', e.target.value)}
                        className="h-10 w-20 rounded cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={options.bgColor}
                        onChange={(e) => updateOption('bgColor', e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Correction Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Error Correction Level
                  </label>
                  <select
                    value={options.level}
                    onChange={(e) => updateOption('level', e.target.value as ErrorCorrectionLevel)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Higher levels allow more damage but produce denser codes
                  </p>
                </div>

                {/* Margin */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">
                      Include Margin
                    </label>
                    <button
                      onClick={() => updateOption('includeMargin', !options.includeMargin)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        options.includeMargin ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          options.includeMargin ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="glass-effect rounded-xl p-8 shadow-lg w-full max-w-md fade-in">
              {text ? (
                <div className="space-y-4">
                  <div 
                    ref={qrRef}
                    className="flex justify-center p-4 bg-white rounded-lg"
                    style={{ backgroundColor: options.bgColor }}
                  >
                    <QRCodeCanvas
                      value={text}
                      size={options.size}
                      level={options.level}
                      bgColor={options.bgColor}
                      fgColor={options.fgColor}
                      includeMargin={options.includeMargin}
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={downloadQRCode}
                      className="button-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <FiDownload />
                      <span>Download</span>
                    </button>
                    
                    <button
                      onClick={copyToClipboard}
                      className="button-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      {copied ? <FiCheck /> : <FiCopy />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  
                  {/* Info */}
                  <p className="text-xs text-center text-gray-500">
                    QR Code will update automatically as you type
                  </p>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center animate-pulse-slow">
                    <span className="text-gray-400 text-4xl font-bold">QR</span>
                  </div>
                  <p className="text-gray-500">
                    Enter some content to generate a QR code
                  </p>
                </div>
              )}
            </div>

            {/* Tips */}
            {text && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md w-full fade-in">
                <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use high error correction for QR codes on curved surfaces</li>
                  <li>• Test your QR code with multiple scanning apps</li>
                  <li>• Keep content short for faster scanning</li>
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default App