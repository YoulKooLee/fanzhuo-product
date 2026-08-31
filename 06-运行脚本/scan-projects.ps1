# Axhub Make 项目扫描脚本
param([string]$RootDir)

$result = @()
$i = 1

# 扫描根目录下所有文件夹
$dirs = Get-ChildItem -Path $RootDir -Directory | Where-Object { $_.Name -notmatch '^_' }

foreach ($dir in $dirs) {
    $pkgPath = Join-Path $dir.FullName "package.json"
    $found = $false

    if (Test-Path $pkgPath) {
        try {
            $pkg = Get-Content $pkgPath -Raw -Encoding UTF8 | ConvertFrom-Json
            if ($pkg.name -eq "@axhub/make-client") {
                $result += "$i. $($dir.Name)"
                $i++
                $found = $true
            }
        } catch {}
    }

    # 嵌套子目录（如 Digital Twin/数字孪生）
    if (-not $found) {
        $subDirs = Get-ChildItem -Path $dir.FullName -Directory -ErrorAction SilentlyContinue
        foreach ($sub in $subDirs) {
            $subPkg = Join-Path $sub.FullName "package.json"
            if (Test-Path $subPkg) {
                try {
                    $pkg = Get-Content $subPkg -Raw -Encoding UTF8 | ConvertFrom-Json
                    if ($pkg.name -eq "@axhub/make-client") {
                        $result += "$i. $($dir.Name)\$($sub.Name)"
                        $i++
                        $found = $true
                    }
                } catch {}
            }
        }
    }

    # 检查 .axhub/make 或 src/prototypes（即使 package.name 不匹配）
    if (-not $found) {
        $hasProto = Test-Path (Join-Path $dir.FullName "src/prototypes")
        $hasAxhub = Test-Path (Join-Path $dir.FullName ".axhub/make")
        if ($hasProto -or $hasAxhub) {
            $result += "$i. $($dir.Name)"
            $i++
            $found = $true
        } else {
            # 子目录可能包含项目
            $subDirs = Get-ChildItem -Path $dir.FullName -Directory -ErrorAction SilentlyContinue
            foreach ($sub in $subDirs) {
                $subProto = Test-Path (Join-Path $sub.FullName "src/prototypes")
                $subAxhub = Test-Path (Join-Path $sub.FullName ".axhub/make")
                if ($subProto -or $subAxhub) {
                    $result += "$i. $($dir.Name)\$($sub.Name)"
                    $i++
                }
            }
        }
    }
}

if ($result.Count -eq 0) {
    Write-Output "NO_DIRS"
} else {
    Write-Output ($result -join "`n")
}
