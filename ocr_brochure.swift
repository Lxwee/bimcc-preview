import Cocoa
import Vision

let pagesDir = "/Users/bimcc/Desktop/Design Website/官网升级/bimcc-redesign/assets/brochure/pages"
let outputFile = "/Users/bimcc/Desktop/Design Website/官网升级/bimcc-redesign/brochure_full_ocr.md"

var outputText = "# 筑云科技-公司宣传册（电子版）完整 OCR 识别内容\n\n"

for i in 1...68 {
    let filename = String(format: "page_%02d.png", i)
    let path = (pagesDir as NSString).appendingPathComponent(filename)
    
    outputText += "\n---\n## Page \(i)\n\n"
    
    guard let image = NSImage(contentsOfFile: path),
          let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        outputText += "(Failed to load image)\n"
        continue
    }
    
    let semaphore = DispatchSemaphore(value: 0)
    var pageLines: [String] = []
    
    let request = VNRecognizeTextRequest { request, error in
        defer { semaphore.signal() }
        guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
        for observation in observations {
            if let topCandidate = observation.topCandidates(1).first {
                pageLines.append(topCandidate.string)
            }
        }
    }
    request.recognitionLanguages = ["zh-Hans", "en-US"]
    request.recognitionLevel = .accurate
    
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    try? handler.perform([request])
    semaphore.wait()
    
    outputText += pageLines.joined(separator: "\n") + "\n"
    print("Processed Page \(i)/68")
}

try? outputText.write(toFile: outputFile, atomically: true, encoding: .utf8)
print("Finished all 68 pages OCR! Output saved to: \(outputFile)")
