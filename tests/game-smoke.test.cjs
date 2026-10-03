const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const { createPreviewServer } = require('../scripts/preview.cjs');
const { join } = require('node:path');
const { chromium } = require('playwright');

const gamePath = join(__dirname, '..', 'index.html');

test('inline game JavaScript parses', async () => {
  const html = await readFile(gamePath, 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, 'index.html contains the game script');
  new (require('node:vm').Script)(script, { filename: 'index.html' });
});

test('game loads and runs from the GitHub Pages path at desktop and phone widths', async () => {
  // Test-only access to the real rules and clock; no debug API ships with the game.
  const html = (await readFile(gamePath, 'utf8')).replace('})();', `
    window.gameTest = {
      snapshot: () => ({ state, elapsed, playerX, targetX, selected, moveDir,
        caught, bonks, finalScore, trees: trees.length, objects: objects.length }),
      geometry: () => ({ body: { w: chars[selected].w, h: chars[selected].h }, basket: basketBounds(), playerX, groundY }),
      bodyHit, choose,
      squirrel: { make: makeSquirrel, bounds: sBounds, width: sWidth, position: sPos,
        destination: pickSquirrelDestination, journey: pickSquirrelJourney,
        move: moveSquirrel, update: updateSquirrel,
        draw: drawSquirrel, toss, launchHawk, reset,
        get population() { return squirrels }, get objects() { return objects },
        get trees() { return trees }, get hawk() { return hawk } },
      lose: () => {
        objects = [{ kind: 'cone', type: 'green', x: playerX, y: groundY-10,
          r: 2, vx: 0, vy: 0, g: 340, spin: 0, rot: 0 }];
        bonks = cfg.maxBonks-1; invuln = 0; update(.001);
      },
      catchAt: (x, y) => {
        objects = [{ kind: 'cone', type: 'green', x, y,
          r: 2, vx: 0, vy: 1, g: 340, spin: 0, rot: 0 }]; update(.001);
      },
      bodyEdge: () => ({ x: playerX, y: groundY-50, r: .1 })
    };
  })();`);
  const server = createPreviewServer(html);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;

  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, hasTouch: viewport.width < 720 });
      await page.clock.install();
      await page.clock.pauseAt(new Date());
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') errors.push(message.text());
      });

      const url = `http://127.0.0.1:${server.address().port}/cone_catcher/`;
      const response = await page.goto(url);
      assert.equal(response.status(), 200);
      assert.equal(await page.title(), 'Cone Catcher');
      assert.ok(await page.locator('#game').evaluate(canvas => canvas.width > 0 && canvas.height > 0));
      const snapshot = () => page.evaluate(() => gameTest.snapshot());
      assert.equal((await snapshot()).state, 'ready');
      await page.clock.runFor(1000);
      assert.equal((await snapshot()).elapsed, 0, 'setup never runs the simulation');

      // Arrow clicks, keyboard navigation and horizontal flicks all wrap two choices.
      await page.locator('#character-next').click();
      assert.equal(await page.locator('#character-name').textContent(), 'Character 2');
      await page.locator('#character-next').click();
      assert.equal(await page.locator('#character-name').textContent(), 'Character 1');
      await page.locator('#character-prev').click();
      assert.equal(await page.locator('#character-name').textContent(), 'Character 2');
      await page.locator('#character-prev').press('ArrowRight');
      assert.equal(await page.locator('#character-name').textContent(), 'Character 1');
      const preview = await page.locator('#character-preview').boundingBox();
      await page.mouse.move(preview.x+preview.width*.8, preview.y+preview.height*.5);
      await page.mouse.down();
      await page.mouse.move(preview.x+preview.width*.2, preview.y+preview.height*.5);
      await page.mouse.up();
      assert.equal(await page.locator('#character-name').textContent(), 'Character 2');
      assert.equal((await snapshot()).state, 'ready', 'flick does not start the game');
      await page.mouse.move(preview.x+preview.width/2, preview.y+20);
      await page.mouse.down();
      await page.mouse.move(preview.x+preview.width/2+5, preview.y+90);
      await page.mouse.up();
      assert.equal((await snapshot()).selected, 'cristian', 'vertical gesture does not select');
      if (viewport.width < 720) {
        // Exercise touch on a separate page, with time between distinct gestures.
        const touchPage = await browser.newPage({viewport,hasTouch:true});
        await touchPage.clock.install();
        await touchPage.clock.pauseAt(new Date());
        touchPage.on('pageerror', error => errors.push(error.message));
        await touchPage.goto(url);
        await touchPage.locator('#character-next').tap();
        await touchPage.clock.runFor(500);
        assert.equal(await touchPage.locator('#character-name').textContent(), 'Character 2');
        const touch = await touchPage.context().newCDPSession(touchPage);
        const box = await touchPage.locator('#character-preview').boundingBox();
        const y = box.y+box.height/2;
        await touch.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x:box.x+90,y}]});
        await touch.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[{x:box.x+20,y}]});
        await touch.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
        await touchPage.clock.runFor(500);
        assert.equal(await touchPage.locator('#character-name').textContent(), 'Character 1', 'touch flick selects the other skin');
        const arrow = await touchPage.locator('#character-next').boundingBox();
        await touch.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x:arrow.x+arrow.width/2,y:arrow.y+arrow.height/2}]});
        await touch.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
        await touchPage.clock.runFor(500);
        assert.equal(await touchPage.locator('#character-name').textContent(), 'Character 2', 'touch arrow wraps correctly');
        await touchPage.locator('#start').tap();
        await touchPage.clock.runFor(300);
        assert.equal(await touchPage.evaluate(() => gameTest.snapshot().state), 'playing', 'tap after flick starts once');
        const movement = await touchPage.locator('#left').boundingBox();
        const pauseControl = await touchPage.locator('#pause').boundingBox();
        const finger1 = {id:10,x:movement.x+movement.width/2,y:movement.y+movement.height/2};
        const finger2 = {id:11,x:pauseControl.x+pauseControl.width/2,y:pauseControl.y+pauseControl.height/2};
        await touch.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[finger1]});
        await touchPage.clock.runFor(100);
        await touch.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[finger1,finger2]});
        await touch.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[finger1]});
        assert.equal(await touchPage.evaluate(() => gameTest.snapshot().moveDir), 0, 'second-finger pause clears held touch movement');
        await touch.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
        await touchPage.clock.runFor(300);
        assert.equal(await touchPage.evaluate(() => gameTest.snapshot().state), 'paused', 'touch pause does not activate twice');
        await touchPage.locator('#resume').tap();
        await touchPage.clock.runFor(300);
        assert.equal(await touchPage.evaluate(() => gameTest.snapshot().state), 'playing', 'touch resume activates once');
        await touchPage.locator('#restart').tap();
        assert.equal(await touchPage.evaluate(() => gameTest.snapshot().state), 'ready', 'touch reset returns to setup');
        await touch.detach();
        await touchPage.close();
      }

      await page.locator('#settings-open').click();
      assert.equal(await page.locator('#play-screen').isVisible(), false);
      await page.locator('#throw-min').fill('4');
      await page.locator('#throw-max').fill('1');
      await page.locator('#max-bonks').fill('1');
      await page.clock.runFor(1000);
      assert.equal((await snapshot()).elapsed, 0, 'settings never run the simulation');
      await page.locator('#settings-back').click();
      assert.equal(await page.locator('#throw-max').inputValue(), '4', 'settings keep min/max validation');
      assert.equal((await snapshot()).selected, 'cristian', 'settings retain character');

      await page.locator('#start').click();
      await page.evaluate(() => document.querySelector('#start').click());
      await page.clock.runFor(1000);
      const running = await snapshot();
      assert.ok(running.elapsed > .9 && running.elapsed < 1.1, 'Start schedules exactly one game loop');
      await page.evaluate(() => gameTest.choose('jack'));
      assert.equal((await snapshot()).selected, 'cristian', 'selection is locked during play');
      assert.equal(await page.locator('#pause').isEnabled(), true);

      const left = await page.locator('#left').boundingBox();
      await page.mouse.move(left.x+left.width/2, left.y+left.height/2);
      await page.mouse.down();
      await page.clock.runFor(120);
      // Use another pointer to pause while movement is held, as on a phone.
      await page.evaluate(() => document.querySelector('#pause').click());
      const paused = await snapshot();
      assert.equal(paused.moveDir, 0, 'pause clears held movement');
      assert.equal(paused.targetX, paused.playerX, 'pause cancels drag/movement targets');
      assert.equal(await page.locator('#pause').textContent(), 'Resume');
      await page.clock.runFor(1500);
      assert.deepEqual(await snapshot(), paused, 'pause freezes all run state');
      await page.mouse.up();
      await page.locator('#resume').click();
      await page.clock.runFor(300);
      assert.equal((await snapshot()).playerX, paused.playerX, 'resume waits for fresh input');
      assert.ok((await snapshot()).elapsed > paused.elapsed, 'resume advances time');
      assert.equal(await page.locator('#pause').textContent(), 'Pause');

      async function checkReset() {
        await page.locator('#restart').click();
        const ready = await snapshot();
        assert.equal(ready.state, 'ready');
        assert.equal(ready.elapsed, 0);
        assert.equal(ready.bonks, 0);
        assert.equal(ready.caught, 0);
        assert.equal(ready.objects, 0);
        assert.equal(ready.trees, 3);
        assert.equal(ready.moveDir, 0);
        assert.equal(ready.selected, 'cristian');
        assert.equal(await page.locator('#max-bonks').inputValue(), '1');
        await page.clock.runFor(300);
        assert.deepEqual(await snapshot(), ready, 'reset does not restart itself');
      }
      await checkReset(); // Reset while playing.
      await page.locator('#start').click();
      await page.locator('#pause').click();
      await checkReset(); // Reset while paused.
      await page.locator('#start').click();
      assert.equal(await page.locator('#pause').textContent(), 'Pause');
      await page.evaluate(() => gameTest.lose());
      assert.equal((await snapshot()).state, 'over', 'body collision ends the run');
      const over = await snapshot();
      await page.clock.runFor(300);
      assert.deepEqual(await snapshot(), over, 'game over stops the simulation');
      await checkReset(); // Reset after game over.
      await page.locator('#start').click();
      await page.evaluate(() => gameTest.lose());
      await page.locator('#play-again').click();
      assert.equal((await snapshot()).state, 'ready', 'Play again returns to selection');

      // Test the original geometry through actual catch/body rules for both skins.
      const geometries = [];
      for (const id of ['jack', 'cristian']) {
        await page.evaluate(id => gameTest.choose(id), id);
        const geometry = await page.evaluate(() => gameTest.geometry());
        geometries.push(geometry);
        assert.equal(await page.evaluate(() => gameTest.bodyHit(gameTest.bodyEdge())), id==='jack',
          'an object above Character 2 still touches the taller Character 1');
        const bodyRight = geometry.playerX + geometry.body.w*.38;
        for (const [offset, hit] of [[.05, true], [.2, false]]) {
          assert.equal(await page.evaluate(p => gameTest.bodyHit(p),
            {x:bodyRight+offset,y:geometry.groundY-20,r:.1}), hit, 'body edge matches each skin width');
        }
        await page.locator('#start').click();
        const b = geometry.basket, cy = (b.y1+b.y2)/2;
        await page.evaluate(p => gameTest.catchAt(p.x,p.y), {x:b.x2+3,y:cy});
        assert.equal((await snapshot()).caught, 0, 'cone outside basket edge is not caught');
        await page.evaluate(p => gameTest.catchAt(p.x,p.y), {x:b.x2+1,y:cy});
        assert.equal((await snapshot()).caught, 1, 'cone overlapping basket edge is caught for each skin');
        await page.locator('#restart').click();
      }
      assert.deepEqual(geometries.map(g => g.body), [{w:17,h:52},{w:16,h:47}]);
      assert.notEqual(geometries[0].basket.y1, geometries[1].basket.y1);
      assert.equal(await page.locator('#characters button').count(), 2);
      assert.equal(await page.locator('#restart').evaluate(el => getComputedStyle(el).userSelect), 'none');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'page fits viewport width');
      const controls = await page.locator('#right').boundingBox();
      assert.ok(controls.y+controls.height <= viewport.height, 'movement controls fit below the playfield');
      await page.locator('#start').click();
      await page.evaluate(() => window.dispatchEvent(new Event('blur')));
      assert.equal((await snapshot()).state, 'paused', 'losing focus pauses the game');
      const motionFailures = await page.evaluate(() => {
        const motion=gameTest.squirrel,failures=[];
        const check=(condition,message)=>{if(!condition&&!failures.includes(message))failures.push(message)};
        const originalRandom=Math.random;let seed=73421;
        Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
        try {
          let horizontal=false,vertical=false,diagonal=false,left=false,right=false;
          for(const tree of [0,1,2]){
            const s=motion.make(tree);s.timer=Infinity;
            let low=s.y,high=s.y,journeys=0,scampers=0;
            for(let step=0;step<1200;step++){
              const before={x:s.x,y:s.y,mode:s.mode,traveling:s.traveling},dt=[.005,.033,.1,.5][step%4];
              motion.update(s,dt);
              const b=motion.bounds(s),dx=s.x-before.x,dy=s.y-before.y;
              low=Math.min(low,s.y);high=Math.max(high,s.y);
              if(before.traveling&&!s.traveling){
                if(before.mode==='journey')journeys++;
                if(before.mode==='scamper')scampers++;
              }
              check(s.y>=b.min-1e-8&&s.y<=b.max+1e-8,'squirrel stays within vertical canopy limits');
              check(Math.abs(s.x)<=motion.width(s,s.y)+1e-8,'squirrel stays within its own canopy width');
              check(Math.hypot(dx,dy)<=50*dt+1e-8,'movement remains continuous and speed limited');
              if(before.traveling&&before.mode==='journey'&&s.mode==='journey')
                check(Math.hypot(dx,dy)<=18*dt+1e-8,'climbing between scampers uses the slower speed');
              if(before.traveling&&before.mode==='approach')
                check(Math.hypot(dx,dy)<=40*dt+1e-8,'trunk approaches retain their own speed');
              if(s.traveling){
                check(s.targetY>=b.min&&s.targetY<=b.max,'destination stays within vertical bounds');
                check(Math.abs(s.targetX)<=motion.width(s,s.targetY)+1e-8,'destination stays within canopy width');
              }
              if(Math.abs(dx)>.001&&Math.abs(dy)<.001)horizontal=true;
              if(Math.abs(dy)>.001&&Math.abs(dx)<.001)vertical=true;
              if(Math.abs(dx)>.001&&Math.abs(dy)>.001)diagonal=true;
              if(dx<-.001){left=true;check(s.facing===-1,'moving left faces left')}
              if(dx>.001){right=true;check(s.facing===1,'moving right faces right')}
            }
            check(high-low>=100,'combined climbing and scampers explore a wider vertical area');
            check(journeys>=3&&scampers>=3,'multiple journeys and scampers complete');
          }
          check(horizontal&&vertical&&diagonal,'motion includes horizontal, vertical and diagonal bursts');
          check(left&&right,'squirrels look both ways');

          Math.random=()=>0;
          const rangeProbe=motion.make(0),rangeBounds=motion.bounds(rangeProbe),ranges=[];
          for(const height of [0,.5,1]){
            rangeProbe.x=0;rangeProbe.y=rangeBounds.min+(rangeBounds.max-rangeBounds.min)*height;
            rangeProbe.traveling=false;motion.destination(rangeProbe);
            ranges.push(rangeProbe.targetX);
          }
          check(ranges[0]<=14&&ranges[1]<=28&&ranges[2]>=35&&ranges[2]<=42,
            'horizontal range grows toward the base, with the wider bottom step clipped by foliage');
          check(ranges[2]>ranges[0],'bottom scampers are wider than constrained top scampers');
          motion.move(rangeProbe,.1);
          check(Math.abs(rangeProbe.x-5)<1e-8,'scampers travel at the requested 50px/second');
          Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};

          const s=motion.make(0);s.timer=Infinity;s.rest=0;motion.destination(s);
          check(s.traveling,'a bounded destination is available');
          const destination={x:s.targetX,y:s.targetY};motion.move(s,10);
          check(s.x===destination.x&&s.y===destination.y,'large time steps stop at destination without overshoot');
          check(s.rest>=.3&&s.rest<=.9,'arrival begins an irregular pause');
          const resting={x:s.x,y:s.y};motion.move(s,.05);
          check(s.x===resting.x&&s.y===resting.y,'squirrel remains still during its pause');

          const journeyStart=s.y;motion.journey(s);
          check(Math.abs(s.journeyY-journeyStart)>=60&&Math.abs(s.journeyY-journeyStart)<=120,
            'vertical journey destination is 60–120px away');
          const journeyEnd=s.journeyY;s.scamperWait=100;
          for(let step=0;step<2&&s.traveling;step++)motion.move(s,10);
          check(s.x===0&&s.y===journeyEnd&&!s.traveling&&s.journeyY===null,
            'journey stops at its chosen height without overshoot');

          motion.journey(s);s.scamperWait=0;
          if(s.mode==='approach')motion.move(s,10);
          const interruptedGoal=s.journeyY;motion.move(s,.01);
          check(s.mode==='scamper'&&s.journeyY===interruptedGoal,
            'a short scamper interrupts climbing without changing its goal');
          motion.move(s,10);
          check(s.scamperWait>=1&&s.scamperWait<=2,'climbing legs between scampers last 1–2 seconds');
          motion.move(s,s.rest+.01);
          check(s.mode!=='scamper'&&s.journeyY===interruptedGoal,
            'climbing resumes toward the same height after a scamper and rest');

          // Tree-relative coordinates follow the tree as the scene's ground changes.
          const tree=motion.trees[0],before=motion.position(s),height=tree.h;
          tree.x+=37;tree.h-=15;const moved=motion.position(s);
          check(moved.x===before.x+37&&Math.abs(moved.y-before.y-15)<1e-8,'drawing position follows its own tree');
          tree.x-=37;tree.h=height;

          Math.random=()=>.5;
          s.facing=-1;motion.toss(s);const facingLeft={...motion.objects.at(-1)};
          s.facing=1;motion.toss(s);const facingRight={...motion.objects.at(-1)};
          check(JSON.stringify(facingLeft)===JSON.stringify(facingRight),'facing does not change projectile targeting');
          const position=motion.position(s);
          check(facingRight.x===position.x&&facingRight.y===position.y+3,'throws use the displayed position');
          const ctx=document.querySelector('#game').getContext('2d'),translate=ctx.translate,drawn=[];
          try{ctx.translate=function(x,y){drawn.push([x,y]);return translate.call(this,x,y)};motion.draw(s)}
          finally{ctx.translate=translate}
          check(drawn[0][0]===position.x&&drawn[0][1]===position.y,'renderer uses the same squirrel position');
          s.pause=0;s.rest=100;s.traveling=false;s.timer=0;
          const count=motion.objects.length;motion.update(s,.01);
          check(motion.objects.length===count+1&&s.timer>0,'motion pauses do not stop throwing');

          motion.reset();Math.random=()=>0;
          const hawkTarget=motion.position(motion.population[0]);motion.launchHawk();
          check(motion.hawk.grabX===hawkTarget.x&&motion.hawk.grabY===hawkTarget.y,'hawk interception uses the same position');
        } finally {Math.random=originalRandom}
        return failures;
      });
      assert.deepEqual(motionFailures, [], `squirrel rule failures at ${viewport.width}px`);
      assert.deepEqual(errors, [], `browser errors at ${viewport.width}px`);
      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
