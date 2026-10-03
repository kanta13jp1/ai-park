with open('src/app/feedback-todo/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

target = '''    id: "TODO-76",
    title: "【立体感・アカデミーレッスン】受講ステップ・プロンプトコピー・動画・評価テスト・修了証の3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "todo",
    feedbackQuote: "「Academyの個別レッスン画面（/academy/[course]/[step]）のプロンプトカードや評価テスト、修了証もTiltCardで立体化し、コピーやステップ移動に触覚音響を付与してほしい」",
    actionPlan: "【未着手（TODO-75完了後に着手）】src/components/academy/LessonView.tsx に TiltCard と触覚音響を導入し、プロンプトカード・修了証・目次・前後移動・採点操作を3D立体化＆音響同期します。",'''

replacement = '''    id: "TODO-76",
    title: "【立体感・アカデミーレッスン】受講ステップ・プロンプトコピー・動画・評価テスト・修了証の3Dティルト化＆触覚音響",
    category: "UI/UX",
    author: "社内ユーザー提案",
    authorDept: "開発基盤アーキテクチャ室",
    date: "2026/10/03",
    priority: "中",
    status: "done",
    feedbackQuote: "「Academyの個別レッスン画面（/academy/[course]/[step]）のプロンプトカードや評価テスト、修了証もTiltCardで立体化し、コピーやステップ移動に触覚音響を付与してほしい」",
    actionPlan: "【反映済み】レッスン画面のプロンプトカード・デジタル修了証をTiltCardで3D立体化し、プロンプトコピー・コードコピー・前後レッスン遷移・クイズ選択肢・採点・印刷操作にWeb Audio触覚音響を完全統合しました。",'''

code = code.replace(target, replacement, 1)

with open('src/app/feedback-todo/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Marked TODO-76 as done")
