"""Antigravity Academy のレッスン本文（Claude Academy の構成：導入 → 見出しごとの説明と画面 → 例 → まとめ）。

src/data/academy.ts の各レッスンの blocks をこの内容で置き換える:
    python scripts/academy-video/lesson_content.py
画面の名称・選択肢は、実機の画面キャプチャ（public/images/guide）と公式ドキュメントで確認できたものだけを使う。
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "src" / "data" / "academy.ts"


def h(id_, text): return {"type": "h", "id": id_, "text": text}
def p(text): return {"type": "p", "text": text}
def steps(*items): return {"type": "steps", "items": list(items)}
def tip(text): return {"type": "tip", "text": text}
def warn(text): return {"type": "warn", "text": text}
def img(file, alt): return {"type": "image", "file": file, "alt": alt}
def shot(alt, todo): return {"type": "shot", "alt": alt, "todo": todo}
def prompt(text, label=None): return {"type": "prompt", "text": text, **({"label": label} if label else {})}
def code(text, label=None): return {"type": "code", "text": text, **({"label": label} if label else {})}
def link(href, text): return {"type": "link", "href": href, "text": text}
def recap(text): return [h("recap", "まとめ"), p(text)]


LESSONS = {
    ("antigravity-101", "what"): [
        p("Antigravity は、AI エージェントに作業を任せるための Google のツールです。チャットで「こうしてほしい」と頼むと、エージェントが自分の PC のフォルダの中身を読み、ファイルを作ったり直したりしながら作業を進めます。"),
        h("screen", "画面の見方"),
        p("起動すると、次のような画面が開きます。まずは4か所だけ覚えれば大丈夫です。"),
        img("G5-main.png", "Antigravity のメイン画面"),
        steps(
            "①「Projects」の右のアイコン：作業させたいフォルダを登録する場所",
            "②「New Conversation」：新しい依頼（会話）を始めるボタン",
            "③「Settings」：安全設定などを変える場所（レッスン4で使います）",
            "「Open IDE」：コードを見ながら作業したいときにエディタを開くボタン",
        ),
        h("chat", "頼み方はチャットと同じ"),
        p("画面の中央にある入力欄に、やってほしいことを日本語で書いて送るだけです。「@」でファイルを指定したり、「/」で便利な機能（計画だけ作らせる「/plan」など）を呼び出したりもできます。"),
        img("L1-input.png", "依頼を書く入力欄"),
        h("forms", "4つの使い方"),
        steps(
            "Antigravity 2.0（デスクトップアプリ）：中心となるアプリ。迷ったらこれ",
            "Antigravity IDE：コードを見ながら作業したい人向けのエディタ",
            "CLI（agy）：ターミナルから使いたい人向け",
            "VS Code などの拡張機能：いつものエディタの中で使いたい人向け",
        ),
        h("business", "業務で使うときの前提"),
        p("業務では、会社の Google アカウントのまま、会社の Google Cloud プロジェクト経由で使います。料金は使った分だけ会社の請求にまとまるので、個人で Google AI Pro に加入する必要はありません。"),
        warn("個人の Google アカウントで使う場合は個人向けの利用規約が適用されます。顧客情報・社内機密・未公開のソースコードは入力しないでください。"),
        *recap("Antigravity は、チャットで頼むとエージェントがフォルダの中で作業してくれるツールです。画面は「Projects」「New Conversation」「入力欄」「Settings」の4か所を押さえれば使い始められます。業務では会社の Google Cloud 経由で使います。"),
    ],
    ("antigravity-101", "signin"): [
        p("インストールが終わったら、Antigravity を起動してサインインします。業務で使うときと、個人で学習するときでサインイン方法が違うので注意してください。"),
        h("launch", "起動する"),
        steps("スタートメニューを開き「Antigravity」を探してクリックする", "「Loading Antigravity」と表示されている間は、そのまま待つ"),
        img("S0-loading.png", "起動中の画面（Loading Antigravity）"),
        p("しばらくすると「Welcome to Antigravity」の画面が表示され、サインイン方法を2つから選びます。"),
        img("S1-signin.png", "サインイン方法を選ぶ画面"),
        h("business", "業務で使う場合（会社アカウント）"),
        steps(
            "「Use business account」を選ぶ",
            "「Sign in with business account」の画面で「Continue with Google Cloud」をクリック（「Use advanced SSO config」は使いません）",
        ),
        img("S2-business-cloud.png", "Continue with Google Cloud を選ぶ画面"),
        p("ボタンが「Awaiting Authentication...」に変わり、ブラウザでのログイン待ちになります。"),
        img("S4-awaiting.png", "ブラウザでの認証を待っている画面"),
        steps(
            "ブラウザに「アカウントを選択してください」と表示されるので、会社のアカウント（@ml-mightylink.com）を選ぶ",
            "会社の Google Cloud プロジェクトを選ぶ（プロジェクト ID は AI推進担当から案内されます）",
            "ブラウザに表示される「Open Antigravity」をクリックしてアプリに戻る",
        ),
        img("S3-account-chooser.png", "ブラウザでアカウントを選ぶ画面"),
        tip("「権限がない」などと表示された場合は、管理者側の設定（導入ガイドの A1〜A3）が終わっていない可能性があります。表示されたメッセージをそのまま AI推進担当に送ってください。"),
        link("https://kanta13jp1.github.io/ai-park/guide", "会社の Google Cloud で使うための手順（導入ガイド）"),
        h("personal", "個人で学習する場合"),
        p("「Continue with Google」を選び、個人の Google アカウントでログインします。業務の情報は入力しないでください。"),
        h("setup", "初期設定"),
        steps(
            "テーマ（画面の色）を選ぶ",
            "Google プラグインの選択は、分からなければ何も選ばずに進む",
            "利用規約を確認して「Accept」",
            "「Finish」をクリックすると、メイン画面が開く",
        ),
        shot("テーマ選択〜Finish の画面", "初回起動時に表示されるテーマ選択・プラグイン選択・利用規約・Finish の各画面"),
        *recap("業務では「Use business account」で会社アカウントにサインインし、会社のプロジェクトを選びます。初期設定はテーマ選択 → プラグイン（飛ばしてOK）→ Accept → Finish の順です。"),
    ],
    ("antigravity-101", "safety"): [
        p("使い始める前に、エージェントにどこまで任せるかを決めておきましょう。最初は「何かする前に必ず確認してくれる」設定にしておくと安心です。"),
        h("open", "設定画面を開く"),
        steps("左下の「Settings」をクリック", "左のメニューから「General」を選ぶ"),
        img("G6-settings.png", "Settings の General 画面"),
        h("security-preset", "Security Preset（任せる範囲）"),
        p("「Security Preset」は、エージェントが確認なしでできることの範囲です。右側の ▼ をクリックすると4つの選択肢が出ます。"),
        img("L2-security-preset.png", "Security Preset の設定欄"),
        steps(
            "Default（おすすめ）：ターミナルのコマンド実行と、作業フォルダの外のファイル操作の前に必ず確認が入る",
            "Full machine：コマンドは確認が入るが、PC 内のどのファイルでも読み書きできる",
            "Turbo mode：安全のための確認がすべて無くなる",
            "Custom：項目ごとに自分で細かく決める",
        ),
        img("G6-settings-options.png", "おすすめの設定（Default と Always Ask）"),
        h("plan-review", "Plan Review Policy（計画の確認）"),
        p("「Plan Review Policy」は、作業を始める前に計画を見せてくれるかどうかの設定です。「Always Ask」を選ぶと、エージェントはまず計画を見せて、あなたの確認を待ってくれます。"),
        img("L3-plan-review.png", "Plan Review Policy の設定欄"),
        warn("「Full machine」「Turbo mode」と「Always Proceed」は、慣れるまで・業務では使わないでください。意図しないファイルの変更やコマンドの実行を止められなくなります。"),
        *recap("Settings → General で、Security Preset を「Default」、Plan Review Policy を「Always Ask」にします。これで、エージェントは作業前に計画を見せ、コマンド実行や作業フォルダ外の操作の前に必ず確認してくれます。"),
    ],
    ("antigravity-101", "first-task"): [
        p("いよいよ最初の依頼です。まずは、ファイルを変更しない「質問」から試してみましょう。"),
        h("project", "作業フォルダを登録する"),
        steps(
            "左側の「Projects」の右にあるフォルダ＋のアイコンをクリック",
            "開いた画面で、作業させたいフォルダを選ぶ",
            "「Projects」の一覧にフォルダ名が表示されれば登録完了",
        ),
        img("G5-main.png", "Projects の登録ボタンと New Conversation"),
        h("ask", "依頼を送る"),
        steps(
            "左上の「New Conversation」をクリック",
            "入力欄の上に、登録したフォルダ名が表示されていることを確認する",
            "入力欄に依頼を書いて Enter キーで送る",
        ),
        img("L1-input.png", "依頼を書く入力欄"),
        h("example", "例：フォルダの中身を説明してもらう"),
        p("最初は、次のようにファイルを変更しないことをはっきり書いて頼むと安心です。"),
        prompt("このフォルダの中にあるファイルの構成と、それぞれの役割を初心者にも分かるように説明してください。ファイルは変更しないでください。", "はじめての依頼"),
        shot("エージェントの回答画面", "上のプロンプトを送ったあと、エージェントがフォルダの中身を説明している画面"),
        tip("回答の途中で分からない言葉が出てきたら、そのまま「〇〇とは何ですか？」と続けて質問して大丈夫です。"),
        *recap("「Projects」にフォルダを登録し、「New Conversation」から入力欄に依頼を書いて送ります。最初は「ファイルは変更しないでください」と添えた質問から始めると安全です。"),
    ],
    ("antigravity-practice", "ask"): [
        p("エージェントは、言われたことを言われたとおりに進めます。やり直しを減らすコツは、頼む前に「目的・対象・条件・完了の形」の4点をそろえることです。"),
        h("four", "4点セット"),
        steps(
            "目的：何のためにやるか",
            "対象：どのファイル・どの画面か（ファイル名を具体的に）",
            "条件：変えてはいけないこと・使う言語やルール",
            "完了の形：どうなれば終わりか（テストが通る・画面に表示される など）",
        ),
        h("bad", "よくない例"),
        prompt("問い合わせフォームを直して", "あいまいな依頼"),
        p("これだと、どのファイルの何を、どう直せば終わりなのかが分かりません。エージェントは推測で作業を始めてしまい、意図と違う変更が入りがちです。"),
        h("good", "よい例"),
        prompt("src/app/contact/page.tsx の送信ボタンを、必須項目が空のときは押せないようにしてください。見た目は変えないでください。直したら、どのように確認すればよいかも教えてください。", "4点セットの依頼"),
        p("「対象（ファイル名）」「目的（空のときは押せない）」「条件（見た目は変えない）」「完了の形（確認方法）」がそろっています。"),
        tip("4点を全部思いつかないときは、「この作業を頼みたいです。依頼の前に確認すべきことを質問してください」と頼むと、エージェントが足りない点を聞いてくれます。"),
        *recap("依頼は「目的・対象・条件・完了の形」の4点をそろえます。あいまいなまま頼むより、ファイル名や変えてはいけないことを具体的に書いたほうが、やり直しが減ります。"),
    ],
    ("antigravity-practice", "plan"): [
        p("大きな変更や、どこを直すべきか分からない作業では、いきなり作業させずに、まず計画を作らせるのが安全です。"),
        h("setting", "計画を必ず見せてもらう設定"),
        p("Settings → General の「Plan Review Policy」を「Always Ask」にしておくと、エージェントは作業前に計画を見せて、あなたの確認を待ちます（レッスン「最初に必ず：安全設定」で設定済みのはずです）。"),
        img("L3-plan-review.png", "Plan Review Policy と「/」→「plan」の案内"),
        h("plan", "計画だけ作らせる"),
        steps(
            "入力欄に「/plan」と入力する（「/」を入力すると候補に「plan」が表示されるので、それを選んでもOK）",
            "続けて、やりたいことを書いて送る",
            "エージェントが、作業の前に計画（どのファイルをどう変えるか）を作って見せてくれる",
        ),
        tip("以前の「計画モード」は、今は「/plan」で呼び出す形になっています（アプリ内の案内「Planning mode has moved to /plan」より）。"),
        p("たとえば、次のように「まだ変更しない」ことをはっきり書きます。"),
        prompt("ヘッダーにダークモードの切り替えボタンを付けたいです。まず、どのファイルをどう変更するかの計画だけを作ってください。まだファイルは変更しないでください。", "計画を作らせる依頼"),
        shot("エージェントが計画を示している画面", "上のプロンプトを送ったあと、変更予定のファイルと手順が並んだ計画（implementation plan）が表示された画面"),
        h("check", "計画のチェックポイント"),
        steps(
            "変更するファイルは、思っている範囲に収まっているか",
            "「やらないこと」（触ってほしくないファイルや機能）が守られているか",
            "手順の中に分からないものがあれば、進める前に理由を質問する",
        ),
        p("問題なければ計画どおりに進めてもらい、違っていればその場で「〇〇は変更しないで」などと修正を伝えます。"),
        *recap("「Always Ask」で計画を必ず見せてもらい、大きな作業は「/plan」でまず計画だけ作らせます。変更するファイルとやらないことを確認してから進めてもらいましょう。"),
    ],
    ("antigravity-practice", "git"): [
        p("エージェントは一度に複数のファイルを書き換えます。Git を使えば、何が変わったかを確認でき、意図と違えば元に戻せます。コマンドは右のボタンでコピーできます。"),
        h("branch", "作業前にブランチを作る"),
        p("main（本番用）で直接作業せず、作業用のブランチを作ってから依頼します。"),
        code("git switch -c feature/dark-mode", "作業用ブランチを作る（feature/dark-mode の部分は作業内容に合わせて変える）"),
        h("check", "変わったところを確認する"),
        code("git status", "変更されたファイルの一覧"),
        code("git diff", "変更の中身（追加は + 、削除は - で表示）"),
        p("エージェントに要点をまとめてもらうのも便利です。"),
        prompt("今回変更したファイルと、それぞれの変更内容の要点を一覧にしてください。", "変更内容の確認"),
        h("commit", "問題なければ記録する"),
        code('git add .\ngit commit -m "ヘッダーにダークモード切り替えを追加"', "変更を記録（コミット）する"),
        h("restore", "意図と違えば取り消す"),
        code("git restore <ファイル名>", "コミット前の変更を元に戻す"),
        tip("IDE（Antigravity IDE や VS Code）を使っている場合は、左側の「ソース管理」からも同じ操作をボタンで行えます。"),
        shot("IDE のソース管理画面", "Antigravity IDE の「ソース管理」で、変更されたファイルと差分が表示されている画面"),
        *recap("作業前にブランチを作り、git status と git diff で変更を確認してからコミットします。意図と違う変更は git restore で取り消せます。"),
    ],
    ("antigravity-practice", "error"): [
        p("エラーが出ても慌てなくて大丈夫です。エージェントに必要な情報をそろえて伝えれば、原因と直し方を一緒に探してくれます。"),
        h("tell", "伝える3つのこと"),
        steps(
            "エラーメッセージの全文（省略しない）",
            "直前に何をしたか（実行したコマンド・変更したファイル）",
            "本当はどうなってほしかったか",
        ),
        h("template", "そのまま使える依頼の型"),
        prompt("次のエラーが出ました。原因と直し方を、初心者にも分かるように説明してください。直す前に、どのファイルをどう変更するかを先に教えてください。\n\n【直前にしたこと】\n（例：npm run build を実行した）\n\n【本当はどうなってほしいか】\n（例：ビルドが成功してほしい）\n\n【エラー全文】\n（ここにエラーをそのまま貼り付ける）", "エラー相談の型"),
        h("loop", "直らないときは"),
        steps(
            "同じ修正を3回繰り返しても直らないときは、いったん git restore で元に戻す",
            "頼み方を変える（エラーの前後の状況を詳しく書く・「まず原因の候補を3つ挙げて」と頼む）",
            "それでも解決しないときは、エラー文を添えて Office Hour／お問い合わせへ",
        ),
        *recap("エラー全文・直前にしたこと・期待する結果の3つをそろえて伝えます。同じ修正を繰り返すようなら一度元に戻して、頼み方を変えましょう。"),
    ],
    ("safe-ai-use", "levels"): [
        p("AI に入力してよいデータは、使う AI の種類によって違います。入力する前に「この AI はどのレベルか」を確認しましょう。"),
        h("levels", "3つのレベル"),
        steps(
            "Level 1（社内機密・コード入力可）：会社として契約し、入力データを学習に使わないことが担保された AI（会社の Google Cloud 経由の Antigravity、Gemini Enterprise など）",
            "Level 2（マスキング必須）：氏名・電話番号・顧客名などを置き換えてから入力する",
            "Level 3（公開情報のみ）：個人アカウントの AI ツール。公開情報での学習・試用にとどめる",
        ),
        link("https://kanta13jp1.github.io/ai-park/tools-hub", "AI Tools Hub のセキュリティ基準早見表"),
        h("masking", "マスキングの例"),
        p("Level 2 の AI に相談するときは、個人や会社を特定できる情報を置き換えます。"),
        prompt("取引先A社の担当者（Bさん）から、納期を2週間延ばしてほしいというメールが届きました。丁寧にお断りしつつ、代わりに1週間なら調整できると伝える返信文を作ってください。", "マスキングした相談"),
        tip("実際の会社名・氏名・メールアドレス・電話番号・金額は、「A社」「Bさん」「〇〇円」のように置き換えてから入力します。"),
        *recap("入力前に、使う AI のレベルを確認します。機密や個人情報は Level 1 の AI にだけ入力し、Level 2 ではマスキング、Level 3 では公開情報だけを扱います。"),
    ],
    ("safe-ai-use", "rules"): [
        p("社内で AI を使うときの注意事項5箇条（暫定版）です。迷ったときは、この5つに立ち返ってください。"),
        h("rule1", "1. 機密・個人情報は入力先を選ぶ"),
        p("顧客の個人情報・社内機密・未公開ソースコードは、会社契約で学習不使用が担保された AI（Level 1）にのみ入力します。"),
        h("rule2", "2. 入力前にマスキングする"),
        p("Level 2 のツールでは、氏名・電話番号・メールアドレス・顧客名・案件名などを置き換えてから入力します。"),
        h("rule3", "3. 出力は必ず人が確認する"),
        p("AI の回答やコードには誤りが含まれます。事実・数値・法令・セキュリティに関わる内容は一次情報で確認し、コードはレビューとテストを通してから使います。"),
        h("rule4", "4. 成果物の責任は使った人が持つ"),
        p("AI で作った資料・コードでも、社外に出す・本番に反映する責任は利用者にあります。"),
        h("rule5", "5. 迷ったら使う前に相談する"),
        p("新しいツールの業務利用や、扱ってよいデータか判断できない場合は、利用前に AI推進担当へ相談してください。"),
        tip("詳細は社長・杉村さんとの協議のうえ正式決定されます。最新版は AI Tools Hub の「社内AI利用の注意事項」で確認してください。"),
        *recap("入力先を選ぶ・マスキングする・出力を確認する・責任は使った人・迷ったら相談、の5つです。"),
    ],
    ("safe-ai-use", "help"): [
        p("分からないこと・困ったことがあれば、ひとりで悩まずに相談してください。"),
        h("where", "相談先"),
        steps(
            "Office Hour：画面上部の「AI Office Hour 予約」から",
            "Google Chat の「AI勉強会」スペース",
            "お問い合わせページのフォーム・FAQ",
        ),
        link("https://kanta13jp1.github.io/ai-park/contact", "お問い合わせ・よくある質問"),
        h("how", "相談するときに書くとよいこと"),
        prompt("【やりたいこと】\n【試したこと】\n【困っていること・エラー文】\n【使っているツール】（例：Antigravity 2.0）", "相談メッセージの型"),
        *recap("Office Hour・Google Chat の AI勉強会スペース・お問い合わせページの3か所で相談できます。やりたいこと・試したこと・困っていることを書くと、早く解決できます。"),
    ],
}

INSTALL_RECAP = recap("迷ったらデスクトップアプリを入れます。コードを見たい人は IDE か拡張機能、ターミナル派は CLI（agy）。どれを使っても、業務では会社の Google Cloud 経由でサインインします。")


def ts_literal(blocks):
    return json.dumps(blocks, ensure_ascii=False, indent=2).replace("\n", "\n        ")


def main():
    src = DATA.read_text(encoding="utf-8")
    course = None
    out, i = [], 0
    lines = src.split("\n")
    while i < len(lines):
        line = lines[i]
        m = re.match(r'^    id: "([^"]+)",$', line)
        if m:
            course = m.group(1)
        m2 = re.match(r'^        id: "([^"]+)",$', line)
        if m2:
            lesson = m2.group(1)
        if line == "        blocks: [":
            # 既存の blocks 配列の終わり（同じインデントの "        ]," ）まで読み飛ばす
            j = i + 1
            while lines[j] != "        ],":
                j += 1
            key = (course, lesson)
            if key in LESSONS:
                out.append("        blocks: " + ts_literal(LESSONS[key]) + ",")
                i = j + 1
                continue
            if key == ("antigravity-101", "install") and not any('"recap"' in l or "id: \"recap\"" in l for l in lines[i:j]):
                out.extend(lines[i:j])
                for b in INSTALL_RECAP:
                    out.append("          " + json.dumps(b, ensure_ascii=False) + ",")
                out.append(lines[j])
                i = j + 1
                continue
        out.append(line)
        i += 1
    DATA.write_text("\n".join(out), encoding="utf-8", newline="")
    print("updated", len(LESSONS), "lessons (+ install recap)")


if __name__ == "__main__":
    main()
