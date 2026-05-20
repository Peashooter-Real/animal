// Vanguard Online Simulator Central Card Database
// Contrains card data grouped by Nation for Deck Building and Gameplay rendering.

const VANGUARD_CARDS_DB = {
    nations: [
        { name: "Dark States", color: "#6f42c1", class: "tag-dark" },
        { name: "Stoicheia", color: "#198754", class: "tag-stoicheia" },
        { name: "Dragon Empire", color: "#dc3545", class: "tag-dragon" },
        { name: "Keter Sanctuary", color: "#ffc107", class: "tag-keter" },
        { name: "Brandt Gate", color: "#0dcaf0", class: "tag-brandt" }
    ],
    cards: [
        // ==========================================
        // DARK STATES CARDS
        // ==========================================
        {
            id: "ds_starter_matt",
            name: 'Diabolos, "Innocent" Matt',
            grade: 0, power: 6000, shield: 10000, nation: "Dark States",
            skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ'
        },
        {
            id: "ds_steve",
            name: 'Diabolos, "Bad" Steve',
            grade: 1, power: 8000, shield: 5000, nation: "Dark States",
            skill: '[AUTO]: เมื่อยูนิทนี้วางบน (VC) เลือกการ์ด 1 ใบจากโซลของคุณ คอลลงช่อง (RC) แถวหลังตรงกลาง และ [Soul-Charge 1]\n[CONT](RC): ถ้าอยู่ในสถานะ "Final Rush" ยูนิทนี้ได้รับพลัง +5000'
        },
        {
            id: "ds_richard",
            name: 'Diabolos, "Anger" Richard',
            grade: 2, power: 10000, shield: 5000, nation: "Dark States",
            skill: '[AUTO]: เมื่อยูนิทนี้วางบน (VC) [คอสต์][นำเรียร์การ์ด 1 ใบเข้าสู่โซล] จั่วการ์ด 1 ใบ\n[CONT](RC): ถ้าอยู่ในสถานะ "Final Rush" ยูนิทนี้ได้รับพลัง +5000'
        },
        {
            id: "ds_bruce_g3",
            name: 'Diabolos, "Viamance" Bruce',
            grade: 3, power: 13000, shield: 0, nation: "Dark States", persona: true,
            skill: '[AUTO](V): เมื่อเริ่มแบทเทิลเฟสของคุณ ถ้ายูนิททั้งหมดของคุณมีคำว่า "เดียโบลอส" คุณจะเข้าสู่สถานะ "พลังบุกชั่วอึดใจ" จนจบเทิร์นถัดไปของคู่แข่ง และถ้าแวนการ์ดคู่แข่งเป็นเกรด 3 หรือสูงกว่า จะเข้าสู่สถานะ "พลังระเบิกเฮือกสุดท้าย"\n[AUTO](V): เมื่อยูนิทนี้โจมตี ในสถานะพลังระเบิดเฮือกสุดท้าย [CB1] เลือกแถวแนวตั้ง 1 แถว Stand เรียร์การ์ดเดียโบลอสทั้งหมดในแถวนั้น และได้รับพลัง +5000'
        },
        {
            id: "ds_julian",
            name: 'Diabolos Diver, Julian',
            grade: 3, power: 13000, shield: 0, nation: "Dark States",
            skill: '[AUTO](RC)[1/turn]: เมื่อยูนิทนี้โจมตีแวนการ์ด, [คอสต์][Counter-Blast 1], ยูนิทนี้ได้รับพลัง+2000 จนจบเทิร์น ต่อการ์ดทุกๆ 1 ใบในดาเมจโซนของคุณ หากคุณมีแวนการ์ดที่มีชื่อ "Bruce", และทำการ [Soul-Charge 1] ต่อดาเมจทุกๆ 2 ใบ เลือกการ์ดในโซลของคุณสูงสุดตามจำนวนที่ [Soul-Charge] ด้วยผลนี้ คอลลง (RC) ที่ว่างอยู่'
        },
        {
            id: "ds_megan",
            name: 'Diabolos Madonna, Megan',
            grade: 2, power: 10000, shield: 5000, nation: "Dark States",
            skill: '[AUTO](R): เมื่อยูนิทนี้โจมตี ในสถานะพลังบุกชั่วอึดใจ ยูนิทนี้ได้รับพลัง+10000 จนจบเทิร์น'
        },
        {
            id: "ds_eden",
            name: 'Diabolos Boys, Eden',
            grade: 2, power: 10000, shield: 5000, nation: "Dark States",
            skill: '[CONT](R): ถ้าอยู่ในสถานะพลังบุกชั่วอึดใจ ได้รับพลัง +5000\n[CONT](R): ถ้าเคย Stand ด้วยความสามารถในเทิร์นนี้ ได้รับ Critical +1\n[AUTO](R): เมื่อโจมตีฮิต [CB1] รีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ'
        },
        {
            id: "ds_jamil",
            name: 'Diabolos Buckler, Jamil',
            grade: 2, power: 10000, shield: 5000, nation: "Dark States",
            skill: '[CONT](RC)/(GC): หากอยู่ในสถานะ "Final Burst" ยูนิทนี้ได้รับ พลัง+10000/โล่+5000 (ทำงานในเทิร์นคู่แข่งด้วย)\n[AUTO]: เมื่อวางบนช่อง (RC) หากแวนการ์ดคือ "Diabolos, \"Viamance\" Bruce", [คอสต์][Counter-Blast 1], [Soul-Charge 1], เลือกการ์ดนอร์มอลยูนิทที่มีชื่อ "Diabolos" เกรด 3 หรือต่ำกว่า 1 ใบจากโซล คอลลง (RC) ที่ว่างอยู่'
        },
        {
            id: "ds_stefanie",
            name: 'Diabolos Girls, Stefanie',
            grade: 1, power: 8000, shield: 5000, nation: "Dark States",
            skill: '[CONT](RC): ในสถานะ "Final Rush" ยูนิทอื่นทั้งหมดของคุณในแถวแนวตั้งเดียวกับยูนิทนี้ได้รับพลัง +5000 (ทำงานในเทิร์นคู่แข่งด้วย)'
        },
        {
            id: "ds_mabel",
            name: 'Diabolos Madonna, Mabel',
            grade: 1, power: 7000, shield: 5000, nation: "Dark States",
            skill: '[AUTO](RC): เมื่อยูนิทนี้บูสต์แวนการ์ด ในสถานะ "Final Rush" [CB1] แวนการ์ดได้รับ "Triple Drive" จนจบเทิร์น'
        },
        {
            id: "ds_ivanka",
            name: 'Diabolos Girls, Ivanka',
            grade: 1, power: 8000, shield: 5000, nation: "Dark States",
            skill: '[AUTO](RC): เมื่อยูนิทที่บูสต์ด้วยยูนิทนี้โจมตีฮิตแวนการ์ด ในสถานะ "Final Rush" [คอสต์][CB1 & นำเรียร์การ์ดที่ยูนิทนี้บูสต์ไปไว้ใต้กอง] จั่วการ์ด 1 ใบ เลือกยูนิทอื่นของคุณ 1 ใบ ได้รับพลัง +5000 จนจบเทิร์น'
        },
        {
            id: "ds_taida",
            name: 'Desire Devil, Taida',
            grade: 0, power: 6000, shield: 10000, nation: "Dark States",
            skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ'
        },
        {
            id: "ds_gouman",
            name: 'Desire Devil, Gouman',
            grade: 1, power: 8000, shield: 5000, nation: "Dark States",
            skill: '[AUTO]: เมื่อยูนิทนี้ถูกนำเข้าสู่โซลโดยความสามารถแวนการ์ดของคุณ หากแวนการ์ดคู่แข่งเกรด 3+, [COST][CB1], จนจบเทิร์น เมื่อคู่แข่งจะคอลการ์ดจากมือลง (GC) ต้องคอล 2 ใบขึ้นไปพร้อมกัน'
        },
        {
            id: "ds_boshokku",
            name: 'Desire Devil, Boshokku',
            grade: 2, power: 10000, shield: 5000, nation: "Dark States",
            skill: '[CONT](Soul): ในเทิร์นของคุณ หากคุณมีดาเมจ 4 ใบขึ้นไป "Avaricious Demonic Dragon, Greedon" บน (VC) พลัง +5000'
        },
        {
            id: "ds_greedon",
            name: 'Avaricious Demonic Dragon, Greedon',
            grade: 3, power: 13000, shield: 0, nation: "Dark States", persona: true,
            skill: '[CONT](VC): หากในโซลมี "Avaricious Demonic Dragon, Greedon", Damage Limit ของคุณจะเป็น 7\n[AUTO](VC): เมื่อจบการต่อสู้ที่ยูนิทนี้โจมตี [COST][SB2 & นำเรียร์การ์ด 4 ใบที่สแตนด์อยู่เข้าโซล] Stand ยูนิทนี้ หากในโซลมี 10 ใบขึ้นไป พลัง +15000 จนจบเทิร์น'
        },
        {
            id: "ds_greedon_masques",
            name: 'Avaricious Demonic Dragon King, Greedon Masques',
            grade: 3, power: 13000, shield: 0, nation: "Dark States", persona: true,
            skill: '[CONT]: ยูนิทนี้จะไรด์ได้เฉพาะจากเกรด 3 ที่มี Greedon ในชื่อ\n[CONT](VC): Damage Limit ของคุณจะเป็น 7\n[ACT](VC)[1/Turn]: [COST][นำการ์ดที่มี Greedon ในชื่อที่ต่างจากยูนิทนี้จากมือ/โซล/ดรอป ออกนอกเกม] ดู 7 ใบ เลือก Desire Devil 1 ใบขึ้นมือ\n[AUTO](VC)[1/Turn]: เมื่อจบการต่อสู้ที่ยูนิทนี้โจมตี หากในโซลมี Desire Devil 3 ใบขึ้นไป [COST][นำเรียร์การ์ด 3 ใบที่สแตนด์อยู่เข้าโซล] Stand ยูนิทนี้ พลัง +5000'
        },
        {
            id: "ds_mousheen",
            name: 'Desire Devil, Mousheen',
            grade: 3, power: 13000, shield: 0, nation: "Dark States",
            skill: '[AUTO](Soul): เมื่อแวนการ์ด "Greedon" ของคุณโจมตี หากเป็นการโจมตีครั้งที่ 2 ของเทิร์นนี้ และคุณไม่มีเรียร์การ์ดชื่อเดียวกับการ์ดใบนี้ คุณสามารถคอลการ์ดนี้ลง (RC) หากคอล จนจบเทิร์น ยูนิทนี้ไม่สามารถถูกนำเข้าโซลโดยความสามารถแวนการ์ด และได้รับพลัง +5000.'
        },
        {
            id: "ds_saasyou",
            name: 'Desire Devil, Saasyou',
            grade: 2, power: 10000, shield: 5000, nation: "Dark States",
            skill: '[CONT](Deck): หากแวนการ์ดคือ "Greedon" การ์ดใบนี้มีชื่อร่วมกันกับการ์ดทั้งหมดที่มี "Desire Devil" ในโซลของคุณ\n[CONT](RC)/(GC): หากโซลมี "Desire Devil" 3 ใบขึ้นไป ยูนิทนี้ได้รับ [Power] +5000/[Shield] +5000'
        },
        {
            id: "ds_fuujo",
            name: 'Desire Devil, Fuujo',
            grade: 2, power: 10000, shield: 5000, nation: "Dark States",
            skill: '[AUTO]: เมื่อยูนิทนี้ถูกนำจาก (RC) เข้าสู่โซลโดยความสามารถของแวนการ์ดที่มี "Greedon" ในชื่อการ์ด เลือกเรียร์การ์ดของคู่แข่ง 1 ใบ และคุณสามารถรีไทร์มันได้\n[AUTO](โซล): เมื่อแวนการ์ดที่มี "Greedon" ในชื่อการ์ดของคุณโจมตี [จ่ายคอส][ไบนด์การ์ดนี้] และจนจบการต่อสู้นั้น เมื่อคู่แข่งจะคอลการ์ดจากบนมือลง (GC) พวกเขาต้องคอล 2 ใบขึ้นไปพร้อมกัน'
        },
        {
            id: "ds_xitto",
            name: 'Desire Devil, Xitto',
            grade: 1, power: 8000, shield: 5000, nation: "Dark States",
            skill: '[AUTO]: เมื่อยูนิทนี้ถูกนำจาก (RC) เข้าสู่โซลโดยความสามารถของแวนการ์ดของคุณ เลือกการ์ด 1 ใบจากดรอปของคุณ และนำเข้าสู่โซล'
        },
        {
            id: "ds_pg",
            name: 'Recusal Hate Dragon (Perfect Guard)',
            grade: 1, power: 8000, shield: 0, nation: "Dark States", isPG: true,
            skill: '[Sentinel] (Perfect Guard)\n[AUTO]: เมื่อยูนิทนี้เข้าสู่ G เลือกยูนิทคุณ 1 ใบ ยูนิทนั้นไม่ถูกฮิตจนจบการต่อสู้ ถ้าคุณมีการ์ดในมือตั้งแต่ 2 ใบขึ้นไป ทิ้งการ์ด 1 ใบ'
        },

        // TRIGGERS
        {
            id: "ds_trig_crit",
            name: 'Critical Trigger (Dark States)',
            grade: 0, power: 5000, shield: 15000, nation: "Dark States", trigger: 'Critical',
            skill: 'ทริกเกอร์: คริติคอล (Critical +1 / พลัง +10000)'
        },
        {
            id: "ds_trig_draw",
            name: 'Draw Trigger (Dark States)',
            grade: 0, power: 5000, shield: 5000, nation: "Dark States", trigger: 'Draw',
            skill: 'ทริกเกอร์: จั่ว (จั่วการ์ด 1 ใบ / พลัง +10000)'
        },
        {
            id: "ds_trig_front",
            name: 'Front Trigger (Dark States)',
            grade: 0, power: 5000, shield: 15000, nation: "Dark States", trigger: 'Front',
            skill: 'ทริกเกอร์: ฟรอนท์ (ยูนิทแถวหน้าทั้งหมด พลัง +10000)'
        },
        {
            id: "ds_trig_heal",
            name: 'Heal Trigger (Dark States)',
            grade: 0, power: 5000, shield: 15000, nation: "Dark States", trigger: 'Heal',
            skill: 'ทริกเกอร์: ฮีล (ฟื้นฟูดาเมจ 1 ใบหากเท่ากับหรือมากกว่าคู่แข่ง / พลัง +10000)'
        },
        {
            id: "ds_trig_over",
            name: 'Hades Dragon Deity, Gallmageveld',
            grade: 0, power: 5000, shield: 50000, nation: "Dark States", trigger: 'Over', overPower: '100 Million',
            skill: '[Over Trigger] (มีได้เพียง 1 ใบในเด็ค) เช็คเจอ: จั่ว 1, เลือกยูนิทคุณ 1 ใบ พลัง +100 ล้าน ตลอดเทิร์นนั้น! เอฟเฟกต์เพิ่มเติม: ในไฟท์นี้ ดับเบิ้ลพลังและคริติคอลของยูนิทในแถวหน้าของคุณในเทิร์นของคุณทั้งหมด!'
        },

        // ==========================================
        // STOICHEIA CARDS
        // ==========================================
        {
            id: "st_lotte",
            name: 'Sylvan Horned Beast, Lotte',
            grade: 0, power: 6000, shield: 10000, nation: "Stoicheia",
            skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ'
        },
        {
            id: "st_charis",
            name: 'Sylvan Horned Beast, Charis',
            grade: 1, power: 8000, shield: 5000, nation: "Stoicheia",
            skill: '[ACT](VC)[1/turn]: [คอสต์][Soul-Blast 1] จั่วการ์ด 2 ใบ จากนั้นเลือกการ์ดออเดอร์จากบนมือคุณสูงสุด 1 ใบเพื่อทิ้ง หากไม่ได้ทิ้งด้วยผลนี้ เลือกทิ้งการ์ด 2 ใบจากบนมือคุณ\n[CONT](RC): ถ้าคุณใช้งานออเดอร์ในเทิร์นนี้ ยูนิทนี้ได้รับพลัง +2000'
        },
        {
            id: "st_charis_blacktears",
            name: 'Black Tears Husk Dragon',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO]: เมื่อถูกนำมาวางบน (VC) เลือกนำ Normal Order จากดรอปโซนของคุณไม่เกิน 1 ใบ นำขึ้นมือ'
        },
        {
            id: "st_zorga_g3",
            name: 'Mysterious Rain Spiritualist, Zorga',
            grade: 3, power: 13000, shield: 0, nation: "Stoicheia", persona: true,
            skill: '[CONT](VC): เมื่อคุณจะเล่นนอร์มอลออเดอร์ คุณสามารถ Bind นอร์มอลออเดอร์ที่มีชื่อต่างกันจากดรอปโซน และทำ Alchemagic (รวมคอสต์เข้าด้วยกัน และเพิ่มเอฟเฟกต์ต่อท้าย!)\n[ACT](VC)[1/turn]: [COST][Counter-Blast 1] เลือกการ์ด 1 ใบจากดรอปโซนของคุณ คอลลง (RC)'
        },
        {
            id: "st_zorga_masques",
            name: 'Teasing Spiritualist, Zorga Masques',
            grade: 3, power: 13000, shield: 0, nation: "Stoicheia", persona: true,
            skill: '[CONT]: การ์ดนี้สามารถไรด์ได้จากเกรด 3 ที่มี "Zorga" ในชื่อเท่านั้น\n[CONT](VC): เมื่อคุณจะเล่นนอร์มอลออเดอร์ คุณสามารถ Bind นอร์มอลออเดอร์จากดรอปโซน และทำ Alchemagic\n[CONT](VC): ถ้าคุณทำ Alchemagic ในเทิร์นนี้ ยูนิทแถวหน้าทั้งหมดของคุณได้รับพลัง +10000\n[ACT](VC)[1/turn]: [COST][นำการ์ดที่มี "Zorga" ในชื่อที่ต่างจากยูนิทนี้ 1 ใบจากมือ โซล หรือดรอปออกจากเกม] เลือกการ์ด 1 ใบจากดรอปโซน ถ้าเป็นยูนิทการ์ดให้คอลลง (RC) ถ้าเป็นนอร์มอลออเดอร์ให้ขึ้นมือ'
        },
        {
            id: "st_roaming_dragon",
            name: 'Roaming Prison Dragon',
            grade: 3, power: 5000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO](Drop): เมื่อคุณเล่นนอร์มอลออเดอร์ คุณอาจคอลการ์ดนี้ลง (RC) ถ้าคอลการ์ดนี้แล้ว เลือกทำอย่างใดอย่างหนึ่งต่อไปนี้ ถ้าเป็น Alchemagic ให้ทำทั้งหมดแทน\n・ยูนิทนี้ได้รับพลัง +10000 จนจบเทิร์น\n・ยูนิทนี้ได้รับ Critical +1 จนจบเทิร์น'
        },
        {
            id: "st_order_miasma",
            name: 'Clouded Miasma',
            grade: 3, power: 0, shield: 0, nation: "Stoicheia", type: 'Normal Order',
            skill: '[Normal Order] เล่นด้วย [COST][Counter-Blast 1]!\nเลือกการ์ดเกรด 3 หรือต่ำกว่า 1 ใบจากดรอปโซนของคุณ คอลลง (RC) ถ้าเป็นส่วนหนึ่งของ Alchemagic เลือกแวนการ์ดของคุณ 1 ใบ ได้รับ "[CONT](VC): ยูนิทแถวหน้าทั้งหมดของคุณได้รับพลัง +5000" จนจบเทิร์น'
        },
        {
            id: "st_shadowcloak",
            name: 'Shadowcloak',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO]: เมื่อวางบน (RC) จากมือ ค้นหา Order 1 ใบจากกองเปิดเผย ถ้าดรอปไม่มีชื่อเดียวกันให้ทิ้งใบที่เปิด สับกอง\n[AUTO](RC): เมื่อเล่น Order [SB1] พลัง +5000 ถ้า Alchemagic เลือกเรียร์การ์ดอื่น 1 ใบกลับมือ'
        },
        {
            id: "st_order_wandering",
            name: 'Gather Upon Me, Ye Wandering Souls',
            grade: 2, power: 0, shield: 0, nation: "Stoicheia", type: 'Normal Order',
            skill: '[Normal Order] เล่นด้วย [COST][ทิ้ง Order 1 ใบจากมือ]! แวนการ์ดได้รับ Drive +1 จนจบเทิร์น'
        },
        {
            id: "st_order_sin",
            name: 'Fine Drink of Abolishment for Sins',
            grade: 2, power: 0, shield: 0, nation: "Stoicheia", type: 'Blitz Order',
            skill: '[Blitz Order] เล่นด้วย [COST][SB1]! จั่ว 1 ใบ เลือกยูนิท 1 ใบ +5000 ต่อ Order ชื่อต่างกันในดรอป+ไบนด์รวม จนจบแบทเทิล'
        },
        {
            id: "st_chemdah",
            name: 'Dragontree Wretch, Depth Iweleth',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO]: เมื่อวางบน (RC) [CB1 & SB1] เลือก RC ที่ไม่มี Dragontree Marker วาง Marker ค้นหา Masque of Hydragrum 1 ใบขึ้นมือ สับกอง'
        },
        {
            id: "st_order_malice",
            name: 'Tearful Malice',
            grade: 2, power: 0, shield: 0, nation: "Stoicheia", type: 'Normal Order',
            skill: '[Normal Order] เล่นด้วย [COST][รีไทร์เรียร์การ์ด 2 ใบ]! จั่ว 1 ใบ นำการ์ดนี้เข้าโซล Counter-Charge 1'
        },
        {
            id: "st_keel",
            name: 'Keel Severing',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO](Drop): เมื่อ Zorga Masques บน (VC) โจมตี ถ้าไม่มี Keel Severing บน (RC) [CB1 & รีไทร์เรียร์การ์ด 1 ใบ] คอลการ์ดนี้ลง RC ที่มี Dragontree Marker'
        },
        {
            id: "st_headhunter",
            name: 'Rogue Headhunter',
            grade: 1, power: 8000, shield: 5000, nation: "Stoicheia",
            skill: '[CONT](RC): ถ้าคุณเล่น Order ในเทิร์นนี้ ยูนิทนี้ได้รับพลัง +5000\n[AUTO]: เมื่อวางบน (RC), การทำ Alchemagic และเล่นในเทิร์นนี้ครั้งถัดไป ลดคอสต์ลง [CB1]'
        },
        {
            id: "st_bist",
            name: 'Dragontree Wretch, Bist Aiyatvas',
            grade: 1, power: 8000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO]: เมื่อวางบน (RC) [CB1] เลือก (RC) 1 ช่องที่ไม่มี Dragontree marker แล้วเอาไปวาง\n[ACT](RC)[1/turn]: ถ้าแวนการ์ดเกรด 3 หรือสูงกว่า [CB1 & SB1] นำนอร์มอลออเดอร์ 1 ใบจากดรอปขึ้นมือ'
        },
        {
            id: "st_lattice",
            name: 'Sylvan Horned Beast, Lattice',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[ACT](RC): ถ้าแวนการ์ดของคุณมีชื่อ "Magnolia" และแวนการ์ดคู่แข่งเกรด 3 หรือสูงกว่า [คอสต์][Counter-Blast 1 & นำยูนิทนี้เข้าสู่โซล] เลือกเกรด 4 ที่มีชื่อ "Magnolia" จากบนมือคุณ 1 ใบแล้วไรด์ในสถานะ Stand'
        },
        {
            id: "st_magnolia_king",
            name: 'Sylvan Horned Beast King, Magnolia',
            grade: 3, power: 13000, shield: 0, nation: "Stoicheia", persona: true,
            skill: '[AUTO](VC): เมื่อจบการโจมตีแบทเทิลที่ยูนิทนี้โจมตี [คอสต์][Counter-Blast 1] เลือกเรียร์การ์ดของคุณ 1 ใบจนจบเทิร์นยูนิทนั้นสามารถโจมตีจากแถวหลังได้และได้รับพลัง +5000 หากคุณทำเพอร์โซน่าไรด์ในเทิร์นนี้ เลือกได้ 3 ใบแทน 1 ใบ'
        },
        {
            id: "st_magnolia_elder",
            name: 'Sylvan Horned Beast Emperor, Magnolia Elder',
            grade: 4, power: 13000, shield: 0, nation: "Stoicheia",
            skill: '[AUTO]: เมื่อวางบน (VC) เลือกการ์ด 1 ใบจากโซล คอลลง (RC)\n[CONT](VC): หากมี "Magnolia" ในโซลหรือบน (RC) ของคุณ เรียร์การ์ดทั้งหมดสามารถโจมตีและอินเตอร์เซปต์จากแถวหลังได้ และได้รับพลัง +5000'
        },
        {
            id: "st_inlet_pulse",
            name: 'Blue Artillery Dragon, Inlet Pulse Dragon',
            grade: 3, power: 13000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO](RC): เมื่อจบเทิร์นของคุณ หากมีการโจมตี 4 ครั้งขึ้นไปในเทิร์นนี้ [คอสต์][นำยูนิทนี้เข้าสู่โซล] จั่วการ์ด 1 ใบ'
        },
        {
            id: "st_winnsapooh",
            name: 'Sylvan Horned Beast, Winnsapooh',
            grade: 3, power: 13000, shield: 5000, nation: "Stoicheia",
            skill: '[CONT]Deck/Hand: หากมีแวนการ์ด "Sylvan Horned Beast" เกรด 2 ขึ้นไปที่ไม่ใช่ชื่อตัวมันเอง การ์ดนี้เกรด -1\n[CONT](RC): หากแวนการ์ด "Magnolia" ถูกวางในเทิร์นนี้ ยูนิทนี้ได้รับพลัง +10000'
        },
        {
            id: "st_bojalcorn",
            name: 'Sylvan Horned Beast, Bojalcorn',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[ACT](RC): [CB1] จนจบเทิร์น ยูนิทนี้ได้รับ "[CONT]Back Row (RC): เมื่อยูนิทนี้โจมตี จะโจมตีแถวหน้าคู่แข่งทั้งหมด"'
        },
        {
            id: "st_gabregg",
            name: 'Sylvan Horned Beast, Gabregg',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO](RC): เมื่อยูนิทอื่นในแถวเดียวกับใบนี้โจมตี [SB1] พลัง+10000 และมอบ Guard Restrict ตามเกรดแถวหน้าคู่แข่ง'
        },
        {
            id: "st_giunosla",
            name: 'Sylvan Horned Beast, Giunosla',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO]Back Row (RC): เมื่อยูนิทนี้โจมตี [CB1] เลือกเรียร์การ์ดใบอื่น 1 ใบ ยูนิทนั้นได้รับพลังเท่ากับพลังของยูนิทนี้จนจบเทิร์น'
        },
        {
            id: "st_enpix",
            name: 'Sylvan Horned Beast, Enpix',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[CONT]Back Row (RC): ยูนิทนี้ได้รับพลัง +10000 และถ้าคุณมีเรียร์การ์ดไม่เกิน 3 ใบ ยูนิททั้งหมดในแถวแนวตั้งเดียวกับยูนิทนี้จะไม่ถูกเลือกโดยความสามารถการ์ดของคู่แข่ง'
        },
        {
            id: "st_goildoat",
            name: 'Sylvan Horned Beast, Goildoat',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO]Drop: เมื่อไรด์ Magnolia [เข้าโซล] VG พลัง+5000\n[AUTO](R): โจมตีจากแถวหลังพลัง+10000 ถ้าอยู่แถวกลางจบการต่อสู้ [Retire] จั่ว 1'
        },
        {
            id: "st_alpin",
            name: 'Sylvan Horned Beast, Alpin',
            grade: 2, power: 10000, shield: 5000, nation: "Stoicheia",
            skill: '[AUTO](RC): เมื่อโจมตี VG ถ้าแวนการ์ดคือ Magnolia พลัง+5000 ต่อ G2 ทุก 2 ใบ ถ้า+10000 ขึ้นไป จบการต่อสู้ [Bind] CC1/SC1'
        },
        {
            id: "st_order_condensation",
            name: 'Spiritual Body Condensation',
            grade: 1, power: 0, shield: 0, nation: "Stoicheia", type: 'Normal Order',
            skill: '[Order]: [SB1] เลือกการ์ดเกรดไม่เกินแวนการ์ด 1 ใบจากดรอปโซนคอลลง (RC) และใบนั้นได้รับพลัง +5000 จนจบเทิร์น'
        },
        {
            id: "st_order_frozen",
            name: 'In the Dim Darkness, the Frozen Resentment',
            grade: 1, power: 0, shield: 0, nation: "Stoicheia", type: 'Normal Order',
            skill: '[Order]: [SB1] ดูการ์ด 3 ใบจากบนสุดของกอง เลือก 1 ใบเพื่อทิ้ง สับกอง จากนั้นเลือกการ์ดเกรดไม่เกินแวนการ์ด 1 ใบจากดรอปโซนคอลลง (RC)'
        },
        {
            id: "st_pg",
            name: 'Custodial Dragon (Perfect Guard)',
            grade: 1, power: 8000, shield: 0, nation: "Stoicheia", isPG: true,
            skill: '[Sentinel] (Perfect Guard)'
        },

        // TRIGGERS
        {
            id: "st_trig_crit",
            name: 'Critical Trigger (Stoicheia)',
            grade: 0, power: 5000, shield: 15000, nation: "Stoicheia", trigger: 'Critical',
            skill: 'ทริกเกอร์: คริติคอล (Critical +1 / พลัง +10000)'
        },
        {
            id: "st_trig_draw",
            name: 'Draw Trigger (Stoicheia)',
            grade: 0, power: 5000, shield: 5000, nation: "Stoicheia", trigger: 'Draw',
            skill: 'ทริกเกอร์: จั่ว (จั่วการ์ด 1 ใบ / พลัง +10000)'
        },
        {
            id: "st_trig_front",
            name: 'Front Trigger (Stoicheia)',
            grade: 0, power: 5000, shield: 15000, nation: "Stoicheia", trigger: 'Front',
            skill: 'ทริกเกอร์: ฟรอนท์ (ยูนิทแถวหน้าทั้งหมด พลัง +10000)'
        },
        {
            id: "st_trig_heal",
            name: 'Heal Trigger (Stoicheia)',
            grade: 0, power: 5000, shield: 15000, nation: "Stoicheia", trigger: 'Heal',
            skill: 'ทริกเกอร์: ฮีล (ฟื้นฟูดาเมจ 1 ใบหากเท่ากับหรือมากกว่าคู่แข่ง / พลัง +10000)'
        },
        {
            id: "st_trig_over",
            name: 'Source Dragon Deity, Blessfavor',
            grade: 0, power: 5000, shield: 50000, nation: "Stoicheia", trigger: 'Over', overPower: '100 Million',
            skill: '[Over Trigger] (มีได้เพียง 1 ใบในเด็ค) เช็คเจอ: จั่ว 1, เลือกยูนิทคุณ 1 ใบ พลัง +100 ล้าน ตลอดเทิร์นนั้น! เอฟเฟกต์เพิ่มเติม: คอลการ์ดเกรดไม่เกินแวนการ์ด 1 ใบจากดรอปลงช่องเรียร์การ์ด และยูนิทแถวหน้าทั้งหมดคริติคอล +1 พลัง +10000 จนจบไฟท์!'
        },

        // ==========================================
        // DRAGON EMPIRE CARDS
        // ==========================================
        {
            id: "de_egg",
            name: 'Sunrise Egg',
            grade: 0, power: 6000, shield: 10000, nation: "Dragon Empire",
            skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ'
        },
        {
            id: "de_rino",
            name: 'Heart-pounding Blaze Maiden, Rino',
            grade: 1, power: 8000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO]: เมื่อถูกไรด์ทับโดย "Snuggling Blaze Maiden, Reiyu" ค้นหา "Trickstar" 1 ใบจากกองการ์ดคอลลง (RC) และสับกอง\n[CONT](RC): ในเทิร์นของคุณ หากมี <Prayer Dragon> ในแถวเดียวกัน พลัง+5000'
        },
        {
            id: "de_reiyu",
            name: 'Snuggling Blaze Maiden, Reiyu',
            grade: 2, power: 10000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO]: เมื่อถูกไรด์ทับโดย "Nirvana Jheva" ดูการ์ด 7 ใบจากบนสุดของกอง เลือก <Prayer Dragon> 1 ใบขึ้นมือ และสับกอง\n[CONT](RC): ในเทิร์นของคุณ หากมี <Prayer Dragon> ในแถวเดียวกัน พลัง+5000'
        },
        {
            id: "de_jheva",
            name: 'Chakrabarthi Pheonix Dragon, Nirvana Jheva',
            grade: 3, power: 13000, shield: 0, nation: "Dragon Empire", persona: true,
            skill: '[ACT](VC)[1/Turn]: [ทิ้งการ์ด 1 ใบ] เลือก "Trickstar" 1 ใบ และ <Prayer Dragon> 1 ใบจากดรอบคอลลง (RC)\n[AUTO](VC): เมื่อโจมตี [CB1] เลือกเรียร์การ์ด 1 ใบที่อยู่ในสถานะ [XoverDress] และ Stand ยูนิทนั้น'
        },
        {
            id: "de_trickstar",
            name: 'Trickstar',
            grade: 0, power: 5000, shield: 5000, nation: "Dragon Empire",
            skill: '[CONT](RC): ไม่สามารถถูกเลือกโดยความสามารถการ์ดของคู่แข่ง'
        },
        {
            id: "de_graillumirror",
            name: 'Illuminate Equip Dragon, Graillumirror',
            grade: 1, power: 8000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO](RC): เมื่อแวนการ์ด "Nirvana" โจมตี [CB1] เลือกเรียร์การ์ดสถานะ overDress หรือ X-overDress 1 ใบ Stand'
        },
        {
            id: "de_stragallio",
            name: 'Strike Equip Dragon, Stragallio',
            grade: 1, power: 8000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO]: เมื่อวางบน (RC) จากบนมือ ถ้าแวนมีชื่อ "Nirvana" [ทิ้งการ์ด 1 ใบ] ค้นหาการ์ดที่มีความสามารถ [overDress] หรือ "Trickstar" 1 ใบขึ้นมือและสับกอง\n[AUTO]: เมื่อตกอยู่ในสถานะ originalDress [CB1] เลือก "Trickstar" จากดรอบคอลลง (RC)'
        },
        {
            id: "de_galondight",
            name: 'Sword Equip Dragon, Galondight',
            grade: 2, power: 10000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO]: เมื่อถูกนำไปซ้อนใต้ร่าง X-overDress เลือกยูนิทที่ซ้อนทับ พลัง+5000 จนจบเทิร์น'
        },
        {
            id: "de_mirrors",
            name: 'Mirror Reflection Equip, Mirrors Vairina',
            grade: 2, power: 10000, shield: 5000, nation: "Dragon Empire",
            skill: 'X-overDress: "Trickstar" & "Graillumirror"\n[AUTO]: เมื่อลง (RC) ด้วย X-overDress เลือก "Vairina" 2 ใบจากดรอบมาซ้อนใต้การ์ดนี้\n[AUTO](RC): เมื่อโจมตี พลัง+10000 จากนั้น [ทิ้งการ์ด Vairina ที่ซ้อนอยู่ 1 ใบ] เลือก "จั่วการ์ด 1 ใบ" หรือ "CC1"'
        },
        {
            id: "de_garou",
            name: 'Jeweled Sword Equip, Garou Vairina',
            grade: 2, power: 10000, shield: 5000, nation: "Dragon Empire",
            skill: 'X-overDress: "Trickstar" & "Galondight"\n[CONT](RC): หากอยู่ในสถานะ X-overDress พลัง+10000 และเมื่อยูนิทนี้โจมตี คู่แข่งต้องคอลการ์ดจากบนมือลง (GC) ครั้งละ 2 ใบขึ้นไป'
        },
        {
            id: "de_baur",
            name: 'Flaring Cannon Equip, Baur Vairina',
            grade: 3, power: 13000, shield: 0, nation: "Dragon Empire",
            skill: '[XoverDress]-One "Trickstar" and one <Prayer Dragon> unit\n[ACT](RC): หากอยู่ในสถานะ X-overDress [SB2] เลือกเรียร์การ์ดคู่แข่ง 1 ใบและรีไทร์\n[AUTO](RC): เมื่อโจมตีแวนการ์ดในสถานะ X-overDress พลัง+2000 ต่อช่อง RC ที่ว่างของคู่แข่ง และถ้าคู่แข่งมีเรียร์การ์ด 1 ใบหรือน้อยกว่า [CB1] ยูนิทนี้ Drive-1 และทำการ Drive Check'
        },
        {
            id: "de_arcs",
            name: 'Vairina Arcs',
            grade: 2, power: 10000, shield: 5000, nation: "Dragon Empire",
            skill: '[overDress]-"Trickstar"\n[AUTO]: เมื่อลง (RC) ในสถานะ overDress [CB1] จั่วการ์ด 2 ใบและพลัง+5000'
        },
        {
            id: "de_undeux",
            name: 'Lizard Runner, Undeux',
            grade: 0, power: 6000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO]: เมื่อยูนิทนี้ถูกไรด์ทับ หากคุณเริ่มทีหลัง จั่วการ์ด 1 ใบ'
        },
        {
            id: "de_bahr",
            name: 'Embodiment of Armor, Bahr',
            grade: 1, power: 8000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO]: เมื่อถูกไรด์ทับโดย "Dragon Knight, Nehalem", [COST][Counter-Blast 1], ค้นหาการ์ดเกรด 1 จากกองการ์ด 1 ใบ นำขึ้นมือ และสับกอง\n[AUTO](RC)[1/turn]: เมื่อแวนการ์ดของคุณโจมตีฮิต, ยูนิทนี้ได้รับ [Power] +5000 จนจบเทิร์น'
        },
        {
            id: "de_nehalem",
            name: 'Dragon Knight, Nehalem',
            grade: 2, power: 10000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO]: เมื่อถูกไรด์ทับโดยยูนิทที่ติดชื่อ "Overlord", คอลการ์ดนี้ลงช่อง (RC).\n[ACT](RC)[1/turn]: ถ้าแวนการ์ดของคุณติดชื่อ "Overlord", [COST][Soul-Blast 1], ยูนิทนี้และแวนการ์ดทั้งหมดของคุณจะได้รับ [Power] +5000 จนจบเทิร์น'
        },
        {
            id: "de_dote",
            name: 'Dragonic Overlord the End',
            grade: 3, power: 13000, shield: 0, nation: "Dragon Empire", persona: true,
            skill: '[CONT](VC): ในเทิร์นของคุณ ถ้าในโซลมีการ์ดชื่อ "Dragonic Overlord" ไดร์ฟของยูนิทนี้จะไม่สามารถลดลงได้ด้วยผลของการ์ด และได้รับ [Power] +5000\n[AUTO](VC)[1/turn]: เมื่อจบการต่อสู้ที่ยูนิทนี้โจมตี, [COST][Counter-Blast 1 & ทิ้งการ์ด 2 ใบจากมือ], [Stand] ยูนิทนี้ และไดร์ฟ -1 จนจบเทิร์น'
        },
        {
            id: "de_overlord",
            name: 'Dragonic Overlord',
            grade: 3, power: 13000, shield: 0, nation: "Dragon Empire", persona: true,
            skill: '[CONT](VC/RC): ในระหว่างแบทเทิลที่ยูนิทนี้โจมตีเรียร์การ์ด คู่แข่งไม่สามารถคอลการ์ดจากมือลง (GC) ได้\n[AUTO](VC)[1/turn]: เมื่อยูนิทนี้โจมตีฮิต, [COST][Counter-Blast 1 & ทิ้งการ์ด 1 ใบจากมือ], [Stand] ยูนิทนี้ และไดร์ฟ -1 จนจบเทิร์น'
        },
        {
            id: "de_brachioforce",
            name: 'Blast Artillery Dragon, Brachioforce',
            grade: 2, power: 10000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO](RC): เมื่อยูนิทนี้โจมตีฮิต, [COST][รีไทร์ยูนิทนี้], จั่วการ์ด 1 ใบ, เลือกเรียร์การ์ดคู่แข่ง 1 ใบ และรีไทร์มัน'
        },
        {
            id: "de_burning_horn",
            name: 'Burning Horn Dragon',
            grade: 2, power: 10000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO]: เมื่อวางลงบน (RC), [COST][Counter-Blast 1], ดูการ์ด 7 ใบจากบนสุดของกอง เลือกการ์ดที่ติดชื่อ "Overlord" ไม่เกิน 1 ใบนำขึ้นมือ จากนั้นสับกอง หากไม่ได้นำขึ้นมือ, [Counter-Charge 1].\n[AUTO](RC): เมื่อแวนการ์ดที่ติดชื่อ "Overlord" ของคุณโจมตี, ยูนิทนี้ได้รับ [Power] +5000 จนจบเทิร์น'
        },
        {
            id: "de_ardor_hatchet",
            name: 'Ardor Hatchet Dragon',
            grade: 2, power: 10000, shield: 5000, nation: "Dragon Empire",
            skill: '[CONT](GC): ถ้าในโซลของคุณมีการ์ดที่ติดชื่อ "Overlord" ยูนิทนี้ได้รับ [Shield] +5000\n[ACT](RC): ถ้าแวนการ์ดคู่แข่งเกรด 3 หรือสูงกว่า, [COST][รีไทร์ยูนิทนี้], เลือกการ์ดเกรด 3 ที่ติดชื่อ "Overlord" จากดรอปโซน 1 ใบ นำเข้าสู่โซล'
        },
        {
            id: "de_halbe",
            name: 'Dragritter, Halbe',
            grade: 1, power: 8000, shield: 5000, nation: "Dragon Empire",
            skill: '[CONT]: เมื่อการ์ดใบนี้ถูกทิ้งจากมือเพื่อจ่ายคоสต์ของแวนการ์ดที่ติดชื่อ "Overlord" การทิ้งนี้สามารถนับเป็นการทิ้ง 2 ใบได้\n[AUTO]: เมื่อถูกทิ้งจากมือเพื่อจ่ายคоสต์ของแวนการ์ดที่ติดชื่อ "Overlord" คุณสามารถคอลการ์ดนี้ลงช่อง (RC) แถวหลังได้ หากคอลลงมา ยูนิทนี้ได้รับ [Power] +5000 จนจบเทิร์น'
        },
        {
            id: "de_gojo",
            name: 'Dragon Monk, Gojo',
            grade: 1, power: 8000, shield: 5000, nation: "Dragon Empire",
            skill: '[AUTO](RC): เมื่อแวนการ์ดที่ยูนิทนี้บูสต์โจมตีฮิต, [COST][รีไทร์ยูนิทนี้], ทำการ [Counter-Charge 1]'
        },
        {
            id: "de_pg_sparkle",
            name: 'Sparkle Rejector Dragon (Perfect Guard)',
            grade: 1, power: 8000, shield: 0, nation: "Dragon Empire", isPG: true,
            skill: '[Sentinel] (Perfect Guard)\n[AUTO]: เมื่อยูนิทนี้เข้าสู่ (GC) เลือกยูนิทคุณ 1 ใบ ยูนิทนั้นจะไม่ถูกฮิตจนจบการต่อสู้ หากในมือของคุณมีตั้งแต่ 2 ใบขึ้นไป ให้ทิ้งการ์ด 1 ใบ'
        },

        // TRIGGERS
        {
            id: "de_trig_crit",
            name: 'Critical Trigger (Dragon Empire)',
            grade: 0, power: 5000, shield: 15000, nation: "Dragon Empire", trigger: 'Critical',
            skill: 'ทริกเกอร์: คริติคอล (Critical +1 / พลัง +10000)'
        },
        {
            id: "de_trig_draw",
            name: 'Draw Trigger (Dragon Empire)',
            grade: 0, power: 5000, shield: 5000, nation: "Dragon Empire", trigger: 'Draw',
            skill: 'ทริกเกอร์: จั่ว (จั่วการ์ด 1 ใบ / พลัง +10000)'
        },
        {
            id: "de_trig_heal",
            name: 'Heal Trigger (Dragon Empire)',
            grade: 0, power: 5000, shield: 15000, nation: "Dragon Empire", trigger: 'Heal',
            skill: 'ทริกเกอร์: ฮีล (ฟื้นฟูดาเมจ 1 ใบหากเท่ากับหรือมากกว่าคู่แข่ง / พลัง +10000)'
        },
        {
            id: "de_trig_over",
            name: 'Dragontree Deity of Resurgence, Dragveda',
            grade: 0, power: 5000, shield: 50000, nation: "Dragon Empire", trigger: 'Over', overPower: '100 Million',
            skill: '[Over Trigger] (มีได้เพียง 1 ใบในเด็ค) เช็คเจอ: จั่ว 1, เลือกยูนิทคุณ 1 ใบ พลัง +100 ล้าน ตลอดเทิร์นนั้น! เอฟเฟกต์เพิ่มเติม: สแตนด์แวนการ์ดของคุณ 1 ใบ!'
        },

        // ==========================================
        // KETER SANCTUARY CARDS
        // ==========================================
        {
            id: "ks_starter_wingul",
            name: 'Wingul Brave',
            grade: 0, power: 6000, shield: 10000, nation: "Keter Sanctuary",
            skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ'
        },
        {
            id: "ks_maron",
            name: 'Little Sage, Maron',
            grade: 1, power: 8000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[AUTO]: เมื่อถูกไรด์ทับโดยเกรด 2 ที่มีคำว่า "Blaster" ดูการ์ด 7 ใบจากบนสุดของกอง เลือกเกรด 2 ที่มีคำว่า "Blaster" ไม่เกิน 1 ใบขึ้นมือและสับกอง หากไม่ได้นำการ์ดขึ้นมือ สามารถเรียก "Wingul Brave" 1 ใบจากโซลคอลลง (RC)\n[CONT](RC): ในเทิร์นของคุณ หากคุณมียูนิท 3 ใบขึ้นไป ยูนิทนี้ได้รับพลัง+2000'
        },
        {
            id: "ks_blaster_blade",
            name: 'Blaster Blade',
            grade: 2, power: 10000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[AUTO]: เมื่อวางบน (VC) [CB1] เลือกรีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ หากไม่รีไทร์ จั่วการ์ด 1 ใบ\n[AUTO]: เมื่อวางบน (RC) [CB1] เลือกรีไทร์เรียร์การ์ดเกรด 2 หรือสูงกว่าของคู่แข่ง 1 ใบ'
        },
        {
            id: "ks_majesty",
            name: 'Majesty Lord Blaster',
            grade: 3, power: 13000, shield: 0, nation: "Keter Sanctuary", persona: true,
            skill: '[CONT](VC): หากในโซลมี "Blaster Blade" และ "Blaster Dark" ยูนิทนี้ได้รับ พลัง+2000/คริติคอล+1 (ทำงานในเทิร์นคู่แข่งด้วย)\n[AUTO](VC): เมื่อโจมตีแวนการ์ด สามารถเลือกทำอย่างใดอย่างหนึ่งดังนี้\n・[นำ "Blaster Blade" จาก (RC) เข้าโซล] เลือกรีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ และยูนิทนี้พลัง +10000\n・[นำ "Blaster Dark" จาก (RC) เข้าโซล] ยูนิทนี้ได้รับพลัง +10000/ไดร์ฟ+1 จนจบเทิร์น'
        },
        {
            id: "ks_blaster_dark",
            name: 'Blaster Dark',
            grade: 2, power: 10000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[AUTO](VC/RC): [CB1 & Retire 1 another RG] เลือกรีไทร์เรียร์การ์ดคู่แข่ง 1 ใบ และยูนิทนี้ได้รับไดร์ฟ+1 จนจบเทิร์น\n[CONT](RC): ในเทิร์นของคุณ หากมีเรียร์การ์ดของคุณถูกรีไทร์ในเทิร์นนี้ พลัง+5000'
        },
        {
            id: "ks_emmeline",
            name: 'Knight of Inheritance, Emmeline',
            grade: 2, power: 10000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[AUTO]: เมื่อลง (RC) จากบนมือ [SB1] ดู 5 ใบ เลือก "Blaster" 1 ใบ คอลลง (RC) หรือนำขึ้นมือแล้วทิ้งการ์ด 1 ใบ\n[AUTO](RC): เมื่อยูนิทที่มีชื่อ "Blaster" ของคุณโจมตี ยูนิทนี้พลัง +5000 จนจบเทิร์น'
        },
        {
            id: "ks_ordeal",
            name: 'Ordeal Dragon',
            grade: 1, power: 8000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[CONT](RC): ในเทิร์นของคุณ หากมี "Blaster Blade" และ "Blaster Dark" ในโซล พลัง+5000\n[AUTO](RC): เมื่อจบการต่อสู้ที่ยูนิทนี้โจมตีหรือบูสต์ [นำยูนิทนี้เข้าโซล] ดูการ์ด 7 ใบจากบนกอง เลือก "Blaster" 1 ใบขึ้นมือและสับกอง'
        },
        {
            id: "ks_cordiela",
            name: 'Knight of Old Fate, Cordiela',
            grade: 1, power: 8000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[CONT] Back Row Center (RC): หากแวนการ์ดคือ "Majesty Lord Blaster" จะได้รับ\n・[AUTO](RC): เมื่อบูสต์เสร็จ [CB1] คอล Blade และ Dark จากโซลลงคอลัมน์เดียวกัน\n・[CONT](RC): หากแวนคู่แข่ง G3+ เรียร์การ์ด G2 ทั้งหมดของคุณได้รับ "Boost"'
        },
        {
            id: "ks_painkiller",
            name: 'Painkiller Angel',
            grade: 1, power: 8000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[AUTO](RC): เมื่อจบการต่อสู้ที่ยูนิทนี้บูสต์ [SB1 & Retire ตัวเอง] จั่วการ์ด 1 ใบ'
        },
        {
            id: "ks_order_dawn",
            name: 'Departure Towards the Dawn',
            grade: 1, power: 0, shield: 0, nation: "Keter Sanctuary", type: 'Normal Order',
            skill: '[Order]: [CB1] ดูการ์ด 5 ใบจากบนกอง เลือก "Blaster" 1 ใบขึ้นมือและสับกอง'
        },
        {
            id: "ks_youth_starter",
            name: 'Youth Following in Footsteps, Youth',
            grade: 0, power: 6000, shield: 10000, nation: "Keter Sanctuary",
            skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ'
        },
        {
            id: "ks_youth_g1",
            name: 'Determined to Break Away, Youth',
            grade: 1, power: 8000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[CONT](VC/RC): ในแบตเทิลที่ยูนิทนี้โจมตี พลัง +2000\n[AUTO]: เมื่อถูกไรด์ทับโดย "Knight of Ardent Light, Youth" [COST][SB1] ดูการ์ด 3 ใบจากบนสุดของกอง เลือกการ์ดที่มีชื่อ "Youthberk" 1 ใบนำขึ้นมือ หรือเลือกยูนิทเกรด 2 หรือต่ำกว่า 1 ใบ คอลลง (RC) นำที่เหลือไว้ใต้กอง'
        },
        {
            id: "ks_youth_g2",
            name: 'Knight of Ardent Light, Youth',
            grade: 2, power: 10000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[AUTO]: เมื่อถูกไรด์ทับโดยยูนิทที่มีความสามารถ [RevolDress] [COST][CB1] เลือกการ์ดเกรด 2 หรือสูงกว่า 1 ใบลงช่องดรอป 1 ใบนำขึ้นมือ'
        },
        {
            id: "ks_youthberk",
            name: 'Youthberk "Skyfall Arms"',
            grade: 3, power: 13000, shield: 0, nation: "Keter Sanctuary", persona: true,
            skill: '[RevolDress]－[AUTO](VC): เมื่อจบการต่อสู้ที่ยูนิทนี้โจมตี เลือกการ์ดที่มีชื่อ "RevolForm" 1 ใบจากในมือ ไรด์ในสถานะ [Stand] และยูนิทนั้นไดร์ฟ -2 จนจบเทิร์น\n[ACT](VC)[1/turn]: [COST][ทิ้งการ์ด 1 ใบจากมือ] ดูการ์ด 3 ใบจากบนสุดของกอง เลือกการ์ดที่มีชื่อ "RevolForm" 1 ใบเปิดเผยแล้วนำขึ้นมือ หรือเลือกยูนิทเกรด 2 หรือต่ำกว่า 1 ใบ คอลลง (RC) นำที่เหลือไว้ใต้กอง'
        },
        {
            id: "ks_revolform_tempest",
            name: 'Youthberk "RevolForm: Tempest"',
            grade: 3, power: 13000, shield: 0, nation: "Keter Sanctuary", persona: true,
            skill: 'RevolDress\n[AUTO](VC): เมื่อวางบน (VC) โดย [RevolDress], แถวหน้าทั้งหมดของคุณได้รับพลัง +5000 จนจบเทิร์น จากนั้น [CB1] เปิดการ์ด 2 ใบจากบนสุดของกอง เลือกเรียร์การ์ดคู่แข่ง 1 ใบที่เกรดตรงกับ 1 ในนั้น นำกลับเข้าใต้กอง, และนำการ์ดที่เปิดทั้งหมดขึ้นมือ\n[AUTO](VC): เมื่อจบเทิร์นของคุณ เลือกการ์ดที่มีความสามารถ [RevolDress] จากโซลแล้วไรด์ในสภาพ [Rest]'
        },
        {
            id: "ks_revolform_gust",
            name: 'Youthberk "RevolForm: Gust"',
            grade: 3, power: 13000, shield: 0, nation: "Keter Sanctuary", persona: true,
            skill: 'RevolDress\n[AUTO]: เมื่อวางบน (VC) โดยความสามารถ [RevolDress] หากแวนการ์ดคู่แข่งเป็นเกรด 3 หรือสูงกว่า [COST][ทิ้งมือ 1 ใบ] ยูนิทนี้ได้รับ [Power]+10000 และ [Drive]+1 จนจบเทิร์น\n[AUTO](VC): เมื่อจบเทิร์นของคุณ เลือกการ์ดที่มีความสามารถ [RevolDress] จากโซลแล้วไรด์ในสภาพ [Rest]'
        },
        {
            id: "ks_schneizal",
            name: 'Knight of Fracture, Schneizal',
            grade: 2, power: 10000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[AUTO]: เมื่อวางบน (RC) [COST][CB1] ดู 5 ใบจากบนสุดของกอง เลือก G3 ที่มีชื่อ "Youthberk" 1 ใบขึ้นมือ สับกอง ยูนิทนี้พลัง +5000 จนจบเทิร์น\n[AUTO](RC): เมื่อยูนิทนี้โจมตีแวนการ์ด หากแวนการ์ดของคุณถูกวางเทิร์นนี้โดยไรด์จาก G3 เลือกแวนการ์ด 1 ใบ พลัง +5000 จนจบเทิร์น'
        },
        {
            id: "ks_dolbraig",
            name: 'Knight of Plowing, Dolbraig',
            grade: 2, power: 10000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[AUTO](แถวหน้า RC): เมื่อแวนการ์ดถูกวางโดย [RevolDress] เลือกแวนการ์ด 1 ใบ พลัง +5000 จนจบเทิร์น\n[AUTO](RC): เมื่อยูนิทนี้โจมตียูนิท G3 หรือสูงกว่า [COST][SB1 การ์ดที่มี RevolForm ในชื่อ] ยูนิทนี้พลัง +10000 จนจบแบทเทิล'
        },
        {
            id: "ks_cairbre",
            name: 'Knight of Rendering Flash, Cairbre',
            grade: 2, power: 10000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[AUTO]: เมื่อวางบน (RC) [COST][CB1 & SB1] ดู 3 ใบจากบนสุดของกอง เลือก 1 ใบ หากเป็นยูนิท G2 หรือต่ำกว่า คอลลง (RC) หากไม่ใช่ นำขึ้นมือ สับกอง'
        },
        {
            id: "ks_sequana",
            name: 'Witch of Accumulation, Sequana',
            grade: 1, power: 8000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[CONT](RC): เทิร์นเรา หากแวนการ์ดมีชื่อ "Youthberk" ยูนิทนี้พลัง +2000\n[AUTO](RC): เมื่อยูนิทถูกวางบน (VC) โดย [RevolDress] [COST][นำยูนิทนี้เข้าโซล] เลือกแวนการ์ด 1 ใบ ปรับ Drive เป็น 1 จนจบเทิร์น'
        },
        {
            id: "ks_therapy_angel",
            name: 'Wayward Therapy Angel',
            grade: 1, power: 10000, shield: 5000, nation: "Keter Sanctuary",
            skill: '[CONT]: การ์ดใบนี้ไม่สามารถถูกไรด์หรือคอลปกติจากมือ\n[AUTO]: เมื่อการ์ดใบนี้ถูกทิ้งจากมือในเทิร์นของคุณ หากแวนการ์ด G3+ [COST][SB1] คอลการ์ดใบนี้ลงแถวหลัง (RC)'
        },
        {
            id: "ks_pg",
            name: 'Palladium Zeal Dragon (PG)',
            grade: 1, power: 8000, shield: 0, nation: "Keter Sanctuary", isPG: true,
            skill: '[Sentinel] (Perfect Guard)\n[AUTO]: เมื่อยูนิทนี้เข้าสู่ G เลือกยูนิทคุณ 1 ใบ ยูนิทนั้นไม่ถูกฮิตจนจบการต่อสู้ ถ้าคุณมีการ์ดในมือตั้งแต่ 2 ใบขึ้นไป ทิ้งการ์ด 1 ใบ'
        },

        // TRIGGERS
        {
            id: "ks_trig_crit",
            name: 'Critical Trigger (Keter)',
            grade: 0, power: 5000, shield: 15000, nation: "Keter Sanctuary", trigger: 'Critical',
            skill: 'ทริกเกอร์: คริติคอล (Critical +1 / พลัง +10000)'
        },
        {
            id: "ks_trig_draw",
            name: 'Draw Trigger (Keter)',
            grade: 0, power: 5000, shield: 5000, nation: "Keter Sanctuary", trigger: 'Draw',
            skill: 'ทริกเกอร์: จั่ว (จั่วการ์ด 1 ใบ / พลัง +10000)'
        },
        {
            id: "ks_trig_front",
            name: 'Front Trigger (Keter)',
            grade: 0, power: 5000, shield: 15000, nation: "Keter Sanctuary", trigger: 'Front',
            skill: 'ทริกเกอร์: ฟรอนท์ (ยูนิทแถวหน้าทั้งหมด พลัง +10000)'
        },
        {
            id: "ks_trig_heal",
            name: 'Heal Trigger (Keter)',
            grade: 0, power: 5000, shield: 15000, nation: "Keter Sanctuary", trigger: 'Heal',
            skill: 'ทริกเกอร์: ฮีล (ฟื้นฟูดาเมจ 1 ใบหากเท่ากับหรือมากกว่าคู่แข่ง / พลัง +10000)'
        },
        {
            id: "ks_trig_over",
            name: 'Light Dragon Deity of Honors, Amartinoa',
            grade: 0, power: 5000, shield: 50000, nation: "Keter Sanctuary", trigger: 'Over', overPower: '100 Million',
            skill: '[Over Trigger] (มีได้เพียง 1 ใบในเด็ค) เช็คเจอ: จั่ว 1, เลือกยูนิทคุณ 1 ใบ พลัง +100 ล้าน ตลอดเทิร์นนั้น! เอฟเฟกต์เพิ่มเติม: ในไฟท์นี้ เรียร์การ์ดของคุณทั้งหมดจะได้รับความสามารถไดร์ฟเช็ค (Drive Check) ในเทิร์นของคุณ!'
        },

        // ==========================================
        // BRANDT GATE CARDS
        // ==========================================
        {
            id: "bg_sora",
            name: 'Blue Deathster, Sora Period',
            grade: 0, power: 6000, shield: 10000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ'
        },
        {
            id: "bg_findanis",
            name: 'Blue Deathster, "Dark Verdict" Findanis',
            grade: 1, power: 8000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อถูกไรด์ทับโดย "Heavenly Death Ray" Stelvane ค้นหา Strategy 1 ใบจากในกองขึ้นมือ\n[CONT](RC): เมื่อยูนิทนี้บูสต์ ถ้ามี Strategy Card ถูกเข้าโซล(ใช้งาน)ในเทิร์นนี้ พลัง+5000'
        },
        {
            id: "bg_stelvane",
            name: 'Blue Deathster, "Heavenly Death Ray" Stelvane',
            grade: 2, power: 10000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อถูกไรด์ทับโดย "Skyrender" Avantgarda ค้นหา Strategy 1 ใบจากในกองขึ้นมือ\n[AUTO](RC): เมื่อโจมตี ถ้ามี Strategy Card ถูกเข้าโซล(ใช้งาน)ในเทิร์นนี้ พลัง+5000'
        },
        {
            id: "bg_avant_g3",
            name: 'Blue Deathster, "Skyrender" Avantgarda',
            grade: 3, power: 13000, shield: 0, nation: "Brandt Gate", persona: true,
            skill: '[ACT](VC)[1/Turn]: หากในโซลมี "Blue Deathster, Sora Period" [เลือก Strategy 1 ใบจาก Order Zone เข้าโซล] จั่วการ์ด 1 ใบ แวนการ์ดพลัง+5000 และได้รับความสามารถ\n"[AUTO](VC)[1/Turn]: เมื่อจบการโจมตี หากโจมตีฮิตแวนการ์ด หรือทำ Persona Ride [CB1 & ทิ้งมือ 1 ใบ] Stand และไดรฟ์-1"'
        },
        {
            id: "bg_richter",
            name: 'Blue Deathster, "Skyrendriver" Avantgarda Richter',
            grade: 3, power: 13000, shield: 0, nation: "Brandt Gate", persona: true,
            skill: '[ACT](Hand): หากแวนคู่แข่งเกรด 3+ [เผยการ์ดนี้ & ไบนด์ "Skyrender" Avantgarda จาก (VC)] ไรด์ Stand และได้รับ [ACT] ของใบที่ถูกไบนด์\n[AUTO](VC): จบการบุก หากโซลมี "Sora Period" [ทิ้งมือ 2 ใบ] ไรด์ "Skyrender" Avantgarda จากไบนด์แบบ Stand, พลัง+10000 และ ไดรฟ์-1'
        },
        {
            id: "bg_winds",
            name: 'Shock Strategy: Death Winds',
            grade: 3, power: 0, shield: 0, nation: "Brandt Gate", type: 'Set Order',
            skill: '[Set Order] (Strategy)\n[AUTO]: เมื่อถูกนำเข้าโซลจาก Order Zone หากแวนการ์ดคู่แข่งระดับ 3 หรือสูงกว่า เลือกแวนการ์ด 1 ใบ "เมื่อโจมตี พลังแถวหน้าทั้งหมด +5000 จนจบเทิร์น"'
        },
        {
            id: "bg_dargente",
            name: 'Ala Dargente',
            grade: 2, power: 10000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO](RC): เมื่อแวนการ์ด "Avantgarda" ของคุณโจมตี ยูนิทนี้ได้รับ พลัง+5000 จนจบเทิร์น\n[AUTO]: เมื่อวางบน (RC) [SB1] ค้นหา Strategy Card ที่ชื่อไม่ซ้ำกับที่เพิ่งใส่โซลจากกองหรือดรอปนำขึ้นมือ 1 ใบ'
        },
        {
            id: "bg_habitable",
            name: 'Sickle Blade of Inquest, Habitable Zone',
            grade: 2, power: 10000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อถูกทิ้งจากมือลงช่องดรอปใน Ride Phase [SB1 & นำการ์ดใบนี้เข้าใต้กอง] จั่วการ์ด 1 ใบ'
        },
        {
            id: "bg_dusting",
            name: 'Bomber Strategy: Dusting',
            grade: 2, power: 0, shield: 0, nation: "Brandt Gate", type: 'Set Order',
            skill: '[Set Order] (Strategy)\n(เข้าโซลเมื่อประกาศใช้งานจากแวนการ์ด)\n[AUTO]: เมื่อถูกส่งเข้าโซลจาก Order Zone แวนการ์ดคุณได้รับพลัง+10000 จนจบเทิร์น และคู่แข่งไม่สามารถอินเตอร์เซปต์หรือเล่น Blitz Order ได้'
        },
        {
            id: "bg_asagi",
            name: 'Blue Deathster, Asagi Milestone',
            grade: 1, power: 8000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อวางบน (RC) หากแวนการ์ดมีชื่อ "Blue Deathster" หรือ "Avantgarda" [CB1] เลือกการ์ด "Avantgarda" เกรด 3 หรือสูงกว่าจากช่องดรอป 1 ใบขึ้นมือ\n[CONT](RC): หาก Strategy Card ถูกใส่เข้าโซลในเทิร์นนี้ ยูนิทนี้ได้รับพลัง+5000'
        },
        {
            id: "bg_hanada",
            name: 'Blue Deathster, Hanada Halfway',
            grade: 1, power: 8000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อวางบน (RC) หากแวนการ์ดมีชื่อ "Blue Deathster" หรือ "Avantgarda" [CB1] จั่วการ์ด 1 ใบ\n[AUTO](RC): เมื่อบูสต์ ถ้าวาง Strategy ลง Order Zone ในเทิร์นนี้ พลัง+2000(จนจบแบตเทิล) และถ้าอยู่ช่องหลังสุดแถวกลาง ได้รับ [CC1]'
        },
        {
            id: "bg_killshroud",
            name: 'Disruption Strategy: Killshroud',
            grade: 1, power: 0, shield: 0, nation: "Brandt Gate", type: 'Set Order',
            skill: '[Set Order] (Strategy)\n[AUTO]: เมื่อถูกนำเข้าโซลจาก Order Zone เลือกเรียร์การ์ดคู่แข่ง 1 ใบรีไทร์ และแวนการ์ดพลัง+5000 จนจบเทิร์น'
        },
        {
            id: "bg_ruby",
            name: 'Aurora Battle Princess, Ruby Red',
            grade: 0, power: 6000, shield: 10000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อถูกไรด์ทับ ถ้าคุณเริ่มเป็นคนที่สอง จั่วการ์ด 1 ใบ'
        },
        {
            id: "bg_kyanite",
            name: 'Aurora Battle Princess, Kyanite Blue',
            grade: 1, power: 8000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อวางลงบน (VC), ค้นหาการ์ด Prison (คุก) จากในกองการ์ดของคุณไม่เกิน 1 ใบ, เปิดเผยและนำขึ้นมือ จากนั้นสับกองการ์ด'
        },
        {
            id: "bg_risatt",
            name: 'Aurora Battle Princess, Risatt Pink',
            grade: 2, power: 10000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อวางลงบน (VC), คู่แข่งเลือกการ์ดจากบนมือของตนเอง 1 ใบ และขังการ์ดนั้นเข้าในคุกของคุณ (นำไปวางในช่อง Order Zone ที่มีคุก)'
        },
        {
            id: "bg_seraph",
            name: 'Aurora Battle Princess, Seraph Snow',
            grade: 3, power: 13000, shield: 0, nation: "Brandt Gate", persona: true,
            skill: '[CONT](VC): ในเทิร์นของคุณ หากมีการ์ดคู่แข่งติดคุกตั้งแต่ 1 ใบขึ้นไป ยูนิทนี้พลัง +10000 และถ้าติดคุกตั้งแต่ 3 ใบขึ้นไป ยูนิทนี้ Drive+1\n[ACT](VC/RC)[1/turn]: [CB1] เลือกเรียร์การ์ดคู่แข่ง 2 ใบ และขังเข้าในคุกของคุณ'
        },
        {
            id: "bg_purelight",
            name: 'Aurora Fierce Princess, Seraph Purelight',
            grade: 4, power: 13000, shield: 0, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อวางลงบน (VC) [CB1 & SB1 การ์ดชื่อ Seraph] คู่แข่งเลือกการ์ดจาก มือ 2 ใบ, เรียร์การ์ด 2 ใบ และโซล 2 ใบ เพื่อขังเข้าในคุกของคุณ'
        },
        {
            id: "bg_penetrate",
            name: 'Aurora Battle Princess, Penetrate Aquas',
            grade: 3, power: 13000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO](RC): เมื่อวางลง ดึงการ์ด 1 ใบจากดรอปคู่แข่งลงคุก\n[CONT](RC/GC): ติดคุก 2ใบ+ พลัง+5000/โหล่+10000 และเมื่อโจมตี คู่แข่งต้องนำการ์ดจากมือป้องกันทีละ 2 ใบขึ้นไป'
        },
        {
            id: "bg_charleen",
            name: 'Aurora Battle Princess, Launcher Charleen',
            grade: 3, power: 13000, shield: 5000, nation: "Brandt Gate",
            skill: '[CONT](RC): เมื่อโจมตี คู่แข่งห้ามลงนอร์มอลยูนิทจากมือ และห้ามใช้ Blitz Order\n[CONT](RC): ตีไม่ได้ถ้าคู่แข่งติดคุก 5 ใบหรือน้อยกว่า'
        },
        {
            id: "bg_violet",
            name: 'Aurora Battle Princess, Derii Violet',
            grade: 2, power: 10000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO](GC): วางลง (GC) คู่แข่งติดคุก 1 ใบ+ [SB1] เลือกยูนิท 1 ใบ จะไม่ถูก Hit โดยแวนเกรด 2 หริอต่ำกว่าจนจบการต่อสู้'
        },
        {
            id: "bg_makarite",
            name: 'Aurora Battle Princess, Accuse Makarite',
            grade: 2, power: 10000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อคอลลง (RC) จากมือ [SB1] ขังใบบนสุดกองคู่แข่ง หงายหน้า, ถ้านักโทษมี 2+ พลัง +5000 จนจบเทิร์น'
        },
        {
            id: "bg_cuffspring",
            name: 'Aurora Battle Princess, Cuff Spring',
            grade: 2, power: 10000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อคอลลง (RC) สั่งให้คู่แข่งเลือกการ์ดในมือ 1 ใบลงคุก หากคู่แข่งขังสำเร็จ ให้จั่วการ์ด 1 ใบ'
        },
        {
            id: "bg_prison_order",
            name: 'Galaxy Central Prison, Galactolus',
            grade: 1, power: 0, shield: 0, nation: "Brandt Gate", type: 'Set Order',
            skill: '[Set Order] คุก: [Rest ยูนิทของคุณ 1 ใบ] เพื่อใช้งาน!\n[AUTO]: เมื่อใช้งาน [SC3].\n[CONT]: คู่แข่งสามารถประกันตัวออกจากคุกได้โดย: จ่าย [SB1] เพื่อเรียก 1 ใบลง (RC) หรือ [CB1] เพื่อเรียก 2 ใบลง (RC).'
        },
        {
            id: "bg_upgrader",
            name: 'Security Upgrader',
            grade: 1, power: 8000, shield: 5000, nation: "Brandt Gate",
            skill: '[ACT](RC): ถ้า Vanguard เกรด 3+ ติดชื่อ Seraph และเทิร์นนี้ไม่ได้ไรด์ [COST][Retire ใบนี้], ค้นหา Seraph เกรด 4 จาก (กอง/มือ/ดรอป) 1 ใบไรด์ทับแบบ Stand, คู่แข่งเลือกการ์ดจากดรอป 1 ใบเข้าคุก และคอสต์ [AUTO] ของแวนที่ไรด์จะลด CB1 จนจบเทิร์น'
        },
        {
            id: "bg_marieda",
            name: 'Aurora Battle Princess, Grenade Marieda',
            grade: 1, power: 8000, shield: 5000, nation: "Brandt Gate",
            skill: '[AUTO]: เมื่อวางลง (RC), เลือกการ์ดในคุก 1 ใบลงใต้กองคู่แข่ง, คู่แข่งเลือก G0 ในดรอป 1 ใบเข้าคุก, ใบนี้พลัง +5000 จนจบเทิร์น'
        },
        {
            id: "bg_muna",
            name: 'Blitz Staff, Muna',
            grade: 1, power: 8000, shield: 5000, nation: "Brandt Gate",
            skill: '[CONT](RC): ถ้าคุกมี 3+ ใบ, ใบนี้ไม่เป็นเป้าหมายสกิลคู่แข่ง และพลัง +5000\n[AUTO](RC)[1/turn]: เมื่อยูนิทถูกเรียกออกจากคุกลง (RC) [COST][SB1] เพื่อจั่วการ์ด 1 ใบ'
        },
        {
            id: "bg_lifle",
            name: 'Aurora Battle Princess, Lifle Royar',
            grade: 1, power: 8000, shield: 5000, nation: "Brandt Gate",
            skill: '[CONT](RC): ในเทิร์นคุณ ถ้าคู่แข่งมี 2+ ใบในคุก, ใบนี้พลัง +5000\n[ACT](RC)[1/turn]: ถ้าเทิร์นนี้มีคนติดคุก [COST][CB1], เลือก RC คู่แข่ง 1 ใบเข้าคุก, ดู 5 ใบจากบนสุดกอง เรียก G <= แวน 1 ใบลง (RC)'
        },
        {
            id: "bg_pg",
            name: 'Automated Belstul (Perfect Guard)',
            grade: 1, power: 8000, shield: 0, nation: "Brandt Gate", isPG: true,
            skill: '[Sentinel] (Perfect Guard)\n[AUTO]: เมื่อยูนิทนี้เข้าสู่ G เลือกยูนิทคุณ 1 ใบ ยูนิทนั้นไม่ถูกฮิตจนจบการต่อสู้ ถ้าคุณมีการ์ดในมือตั้งแต่ 2 ใบขึ้นไป ทิ้งการ์ด 1 ใบ'
        },
        {
            id: "bg_pg_simple",
            name: 'Perfect guard',
            grade: 1, power: 8000, shield: 0, nation: "Brandt Gate", isPG: true,
            skill: '[Sentinel] ยูนิทนี้ไม่ฮิต'
        },

        // TRIGGERS
        {
            id: "bg_trig_crit",
            name: 'Critical Trigger (Brandt Gate)',
            grade: 0, power: 5000, shield: 15000, nation: "Brandt Gate", trigger: 'Critical',
            skill: 'ทริกเกอร์: คริติคอล (Critical +1 / พลัง +10000)'
        },
        {
            id: "bg_trig_draw",
            name: 'Draw Trigger (Brandt Gate)',
            grade: 0, power: 5000, shield: 5000, nation: "Brandt Gate", trigger: 'Draw',
            skill: 'ทริกเกอร์: จั่ว (จั่วการ์ด 1 ใบ / พลัง +10000)'
        },
        {
            id: "bg_trig_front",
            name: 'Front Trigger (Brandt Gate)',
            grade: 0, power: 5000, shield: 15000, nation: "Brandt Gate", trigger: 'Front',
            skill: 'ทริกเกอร์: ฟรอนท์ (ยูนิทแถวหน้าทั้งหมด พลัง +10000)'
        },
        {
            id: "bg_trig_heal",
            name: 'Heal Trigger (Brandt Gate)',
            grade: 0, power: 5000, shield: 15000, nation: "Brandt Gate", trigger: 'Heal',
            skill: 'ทริกเกอร์: ฮีล (ฟื้นฟูดาเมจ 1 ใบหากเท่ากับหรือมากกว่าคู่แข่ง / พลัง +10000)'
        },
        {
            id: "bg_trig_over",
            name: 'Star Dragon Deity of Infinitude, Eldobreath',
            grade: 0, power: 5000, shield: 50000, nation: "Brandt Gate", trigger: 'Over', overPower: '100 Million',
            skill: '[Over Trigger] (มีได้เพียง 1 ใบในเด็ค) เช็คเจอ: จั่ว 1, เลือกยูนิทคุณ 1 ใบ พลัง +100 ล้าน ตลอดเทิร์นนั้น! เอฟเฟกต์เพิ่มเติม: ดับเบิ้ลพลังและคริติคอลของยูนิทในแถวหน้าของคุณในเทิร์นของคุณทั้งหมด!'
        },

        // ==========================================
        // GENERIC CARDS (ANY NATION)
        // ==========================================
        {
            id: "generic_elementaria",
            name: 'Elementaria Sanctitude',
            grade: 1, power: 0, shield: 0, nation: "All", type: 'Blitz Order', isPG: true,
            skill: '[Sentinel] (Perfect Guard) Blitz Order\nเล่นได้ต่อเมื่อคู่แข่งโจมตีและมีแวนการ์ดที่มีความสามารถ Triple Drive! เลือกยูนิทของคุณ 1 ใบ ไม่ถูกโจมตีจนจบแบทเทิลนั้น หากแวนคู่แข่งมีความสามารถ Triple Drive หรือสูงกว่า ไม่ต้องทิ้งมือ!'
        },
        {
            id: "generic_masque",
            name: 'Masque of Hydragrum',
            grade: 3, power: 0, shield: 0, nation: "All", type: 'Normal Order',
            skill: '[Normal Order]\n[ACT]: ดู 5 ใบ เลือกการ์ดที่มี Dragontree หรือ Masques 1 ใบขึ้นมือ จากนั้นสับกอง\n[ACT](Drop): หากแวนการ์ดเกรด 3 และไม่มี Masques ในชื่อ [COST][Reveal เกรด 3 Masques จากบนมือ] ไรด์การ์ดที่ Reveal ในสถานะ [Stand] หากไรด์และคู่แข่งเกรด 3+ และยังไม่ได้ทำ Persona Ride ในเทิร์นนี้ ให้ทำ Persona Ride'
        },
        {
            id: "ds_clean_sweep",
            name: 'Clean-sweep Dragon',
            grade: 2, power: 10000, shield: 5000, nation: "Dark States",
            skill: '[ACT](RC)[1/turn]: หากคุณ Persona Ride ในเทิร์นนี้ [CB1] เลือก Rear-guard ตัวเองหรือคู่แข่งไม่เกิน 3 ใบ นำเข้าโซลผู้เล่นนั้น ยูนิทนี้ได้รับ [Power] +5000 ต่อ 1 ใบ จนจบเทิร์น'
        },
        {
            id: "ds_chemdah",
            name: 'Dragontree Wretch, Skull Chemdah',
            grade: 2, power: 10000, shield: 5000, nation: "Dark States",
            skill: '[AUTO]: เมื่อวางบน (RC) [CB1 & SB1] เลือก (RC) ของคุณที่ไม่มี Dragontree marker วาง Dragontree marker บนช่องนั้น ค้นหา Masque of Hydragrum จากกอง 1 ใบนำขึ้นมือ สับกอง'
        },
        {
            id: "de_order_gratias",
            name: 'Gratias Gradale',
            grade: 3, power: 0, shield: 0, nation: "Dragon Empire", type: 'Normal Order',
            skill: 'Regalis Piece (ใส่ในกองได้ 1 ใบ ใช้งานได้ 1 ครั้งต่อ 1 ไฟท์)\n[Normal Order] ใช้งานต่อเมื่อแวนการ์ดของคุณคือเกรด 3 ที่มี Persona Ride และคุณยังไม่ได้ไรด์ในเทิร์นนี้!\nทำงาน Persona Ride (จั่วการ์ด 1 ใบ, ยูนิทแถวหน้าทั้งหมด [Power] +10000 ในเทิร์นนี้ และถือว่าคุณได้ทำ Persona Ride แล้ว)'
        }
    ]
};

// Expose to window/global scope
if (typeof window !== 'undefined') {
    window.VANGUARD_CARDS_DB = VANGUARD_CARDS_DB;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VANGUARD_CARDS_DB;
}
