# Uploaded font audit

This audit covers the 104 font files supplied in four ZIP archives. Names and weights were read from each font's OpenType `name` and `OS/2` tables. The repository is public, so a font is bundled only when the supplied file itself contains terms that explicitly permit redistribution and web embedding.

## Bundled

| Family | Detected weights | Files | Basis |
| --- | --- | ---: | --- |
| Ario Dots 1–4 | 400 | 4 | Embedded metadata: SIL Open Font License 1.1 |
| Rooyin Free | 400, 700 | 2 | Embedded metadata: SIL Open Font License 1.1 |
| Rooyin Free Dots 2 | 400 | 1 | Embedded metadata: SIL Open Font License 1.1 |

The applicable license and copyright notices are in [`Ario-Rooyin-OFL.txt`](./Ario-Rooyin-OFL.txt).

## Not bundled

| Family | Detected weights | Files | Reason |
| --- | --- | ---: | --- |
| F37 Wicklow Arabic Trial | 300, 400, 500, 700, 800, 900 | 6 | F37 EULA; trial files, no redistribution permission supplied |
| F37 Wicklow Arabic Stencil Trial | 300, 400, 500, 700, 800, 900 | 6 | F37 EULA; trial files, no redistribution permission supplied |
| InstaArabi | 400 | 1 | All rights reserved; no license supplied |
| TROX R | 400 | 1 | All rights reserved; no license supplied |
| Metras | 700 | 1 | All rights reserved; no license supplied |
| Al-Awwal | 400, 700 | 2 | All rights reserved; no redistribution license supplied |
| FoundingDay Free | 400 | 1 | Embedded EULA explicitly prohibits redistribution |
| Jarood | 400 | 1 | All rights reserved; no license supplied |
| Qahwa Arabic | 700 (Regular, Medium, Bold, Black) | 4 | Metadata permits personal/commercial use but does not grant redistribution or web embedding |
| Qahwa Arabic Salt | 700 | 1 | Metadata permits personal/commercial use but does not grant redistribution or web embedding |
| SA Hazm | 400 (variable file) | 1 | No copyright or license metadata supplied |
| Arsenica Arabic Trial | 100, 300, 400, 500, 600, 700, 800 | 7 | Trial EULA prohibits redistribution and commercial/webfont use |
| Lenos | 200–900 | 9 | No license metadata supplied; the Thin file reports weight 900 internally |
| Madika Arabic Trial | 100, 300, 400, 500, 600, 700, 900 | 7 | Trial license prohibits reproduction, transfer, and commercial use |
| Milligram Arabic Trial | 200, 300, 400, 500, 700, 800, 900 | 7 | Trial EULA prohibits redistribution and commercial/webfont use |
| NaN SuperX Sans Display Arabic Trial | 100, 300, 400, 500, 600, 700, 800, 900 | 9 | Trial license is non-commercial only |
| Codec Pro ME Trial | 100, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900 | 11 | Trial EULA prohibits redistribution and commercial/webfont use |
| Mayson Arabic Trial | 100, 200, 300, 400, 500, 700, 800 | 7 | Trial EULA prohibits redistribution and commercial/webfont use |
| Milan Display | 900 | 1 | Personal use only |
| Milan Display Swashes | 900 | 1 | Personal use only |
| Hagrid Arabic Trial | 100, 300, 400, 700, 800, 900, 950 | 7 | Trial EULA prohibits redistribution and commercial/webfont use |
| Hagrid Text Arabic Trial | 400, 500, 700, 800, 900 | 5 | Trial EULA prohibits redistribution and commercial/webfont use |
| Hagrid Variable Trial | 400 default | 1 | Trial EULA prohibits redistribution and commercial/webfont use |

To add an excluded family later, supply a license that explicitly covers repository redistribution and browser/webfont embedding, plus the corresponding licensed font files.
