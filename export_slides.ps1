try {
    $ppt = New-Object -ComObject PowerPoint.Application
    Write-Output "PowerPoint COM available!"
    $presentation = $ppt.Presentations.Open("c:\Users\amanr\Abcd\ABCD - app presentation.pptx", 1, 1, 0)
    $outputDir = "c:\Users\amanr\Abcd\slide_renders"
    if (!(Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir -Force }
    $i = 1
    foreach ($slide in $presentation.Slides) {
        $outPath = Join-Path $outputDir ("slide" + $i + ".png")
        $slide.Export($outPath, "PNG", 1920, 1080)
        Write-Output "Exported slide $i to $outPath"
        $i++
    }
    $presentation.Close()
    $ppt.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
    Write-Output "Exported slides successfully!"
} catch {
    Write-Output "PowerPoint COM error: $_"
}
