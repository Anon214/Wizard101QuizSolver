const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  //login
  const page = await browser.newPage();
  await page.goto(
    "https://www.wizard101.com/quiz/trivia/game/wizard101-trivia"
  );
  await page.type("#loginUserName", "USERNAME_HERE");
  await page.type("#loginPassword", "PASSWORD_HERE");
  await page.click(".wizardButtonInput");
  await page.waitFor(500);

  const aminopages = [
    "https://aminoapps.com/c/wizard101/page/item/adventuring-trivia-answers/B67g_YVTmIJXRa6ZWx0043dQ1LzD62ox3z",
    "https://aminoapps.com/c/wizard101/page/item/conjuring-trivia-answers/dqpv_dwHaI2PKrzKKdk2kKZPgLNkaZQB20",
    "https://aminoapps.com/c/wizard101/page/item/magical-trivia-answers/GZdn_YaiVIzeKrpz6ZmQoM7geawB8nzmzE",
    "https://aminoapps.com/c/wizard101/page/item/marleybone-trivia-answers/gljP_kYTKIVBVlr2lwLQKq7EoY58GYQexa",
    "https://aminoapps.com/c/wizard101/page/item/mystical-trivia-answers/7dpq_ZvFNIa1ox2Z057MQLlBgBldP5xaNw",
    "https://aminoapps.com/c/wizard101/page/item/spellbinding-trivia-answers/l65R_mpTGIgeNVz4x0wYEk8p8p7JbWBZ1l",
    "https://aminoapps.com/c/wizard101/page/item/spells-trivia-answers/mV7B_lXF0IN6XZkgdNmoDr2XJevkNpoweq",
    "https://aminoapps.com/c/wizard101/page/item/wizard-city-trivia-answers/JnQx_qMtMI5d43bLwLWaBgxNmBY0ajNZK",
  ];

  for (var t = 0; t < 8; t++) {
    await page.evaluate(function (t) {
      let a = Array.from(document.querySelectorAll(".thumb a"));
      a[t].click();
    }, t);
    await page.waitFor(1000);

    //amino apps
    const page2 = await browser.newPage();
    await page2.goto(aminopages[t]);
    await page2.bringToFront();
    let p1answ = await page2.$$eval(".italic", (ans) =>
      ans.map((p) => p.innerText)
    );
    let p1ques = await page2.$$eval('[class="center"]', (ans) =>
      ans.map((p) => p.innerText)
    );

    await page.waitFor(1000);
    await page.bringToFront();
    await page.waitForSelector("#nextQuestion");
    p1ques = await p1ques.map((x) => x.replace("’", "'"));
    p1ques = await p1ques.map((x) => x.replace("“", '"'));
    p1answ = await p1answ.map((x) => x.replace("’", "'"));
    p1ques = await p1ques.map((x) =>
      x.replace(
        "21)ZAFARIA is home to what cultures?",
        "21) ZAFARIA is home to what cultures?"
      )
    );
    p1ques = await p1ques.map((x) =>
      x.replace(
        "20)Who tries to raise a GORGON ARMY?",
        "20) Who tries to raise a GORGON ARMY?"
      )
    );
    p1ques = await p1ques.map((x) =>
      x.replace(
        "13)What term best fits STAR MAGIC Spells?",
        "13) What term best fits STAR MAGIC Spells?"
      )
    );
    p1ques = await p1ques.map((x) =>
      x.replace(
        "14)What term best fits SUN MAGIC Spells?",
        "14) What term best fits SUN MAGIC Spells?"
      )
    );
    await page.waitFor(2000);

    let numofp = await page2.$$eval("p .center", (c) => c.length);

    await page.waitFor(100);

    for (let l = 0; l < 12; l++) {
      await page.waitForSelector("#nextQuestion");
      await page.waitFor(200);

      //fetching quiz question data
      let quizQ = await page.$eval(".quizQuestion", (el) => el.innerText);
      let quizA = await page.$$eval(".answerText", (an) =>
        an.map((span) => span.innerText)
      );
      await page.waitFor(200);

      var val = 0;
      for (var i = 1; i < 10; i++) {
        console.log("Counter: " + i);
        console.log(quizQ.substring(0, 25).toLowerCase());
        console.log(p1ques[i - 1].substring(3, 28).toLowerCase());
        if (
          quizQ.substring(0, 25).toLowerCase() ==
          p1ques[i - 1].substring(3, 28).toLowerCase()
        ) {
          val = i;
          break;
        }
      }

      let questionlimit = await (await page2.$$('[class="center"]')).length;

      for (var j = 10; j < questionlimit - 2; j++) {
        console.log("Counter: " + j);
        console.log(quizQ.substring(0, 25).toLowerCase());
        console.log(p1ques[j - 1].substring(4, 29).toLowerCase());
        if (
          quizQ.substring(0, 25).toLowerCase() ==
          p1ques[j - 1].substring(4, 29).toLowerCase()
        ) {
          val = j;
          break;
        }
      }
      if (
        val == 3 &&
        quizQ.substring(0, 25).toLowerCase() == "how many pips does it cos"
      ) {
        for (var i = 1; i < 10; i++) {
          if (
            quizQ.substring(0, 40).toLowerCase() ==
            p1ques[i - 1].substring(3, 43).toLowerCase()
          ) {
            val = i;
            break;
          }
        }
      }

      let answerText = await page.$$eval(".answerText", (anst) =>
        anst.map((span) => span.innerText)
      );

      //replacing inconsistent text
      answerText = await answerText.map((x) => x.replace(".", "")); //wizard101 question data => (converting to) amino apps quiz data
      answerText = await answerText.map((x) => x.replace(":", ""));
      answerText = await answerText.map((x) =>
        x.replace("Pasta Arrabiata", "Pasta Arribata")
      );
      answerText = await answerText.map((x) => x.replace(" � ", "-"));
      answerText = await answerText.map((x) => x.replace("scorch", "scortch"));
      answerText = await answerText.map((x) =>
        x.replace("Pasta Arrabiata", "Pasta Arribata")
      );
      answerText = await answerText.map((x) =>
        x.replace("Mrs Dowager", "Mrs. Dowager")
      );
      answerText = await answerText.map((x) =>
        x.replace("Rattlebones corrupted them", "Rattlebones corrupted them.")
      );
      answerText = await answerText.map((x) => x.replace("155", "1:55"));
      answerText = await answerText.map((x) =>
        x.replace("Sylvia Drake", "Sylvia Drake  ")
      );

      let num1 = 0;
      for (h = 0; h < 4; h++) {
        console.log("p1answ:     " + p1answ[val - 1] + "i");
        console.log("answerText: " + answerText[num1] + "i");
        if (p1answ[val - 1] == answerText[num1]) {
          break;
        }
        num1++;
      }

      if (num1 == 4) {
        num1 = 3;
      }

      const lcheckb = await page.$$(".largecheckbox");
      if (lcheckb) {
        await lcheckb[num1].click();
      }

      await Promise.all([
        page.click("#nextQuestion"),
        page.waitForNavigation({ waitUntil: "networkidle0" }),
      ]);
      await page.waitFor(5000);
    }
    await page2.close();
    await page.goto(
      "https://www.wizard101.com/quiz/trivia/game/wizard101-trivia"
    );
    await page.waitFor(3000);
  }

  //last 2 quizzes

  const l2page = [
    "https://w101tips.wordpress.com/2018/06/25/tenth-grade-vocabulary-trivia/",
    "https://w101tips.wordpress.com/2018/06/26/eleventh-grade-vocabulary-trivia/",
  ];
  var l2current = 0;
  for (var w = 0; w < 2; w++) {
    await page.goto(l2page[l2current]);

    l2current++;
  }

  await browser.close();
})();
