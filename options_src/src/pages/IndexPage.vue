<template>
  <q-page class="container">
    <div class="list-header">11</div>
    <div class="list-body" v-for="item in memoData" :key="item.id">
      <q-toolbar class="bg-primary text-white shadow-2">
        <q-toolbar-title>{{ item.url }}</q-toolbar-title>
      </q-toolbar>
      <q-list bordered>
        <q-item v-for="memo in item.memoList" :key="memo.id">
          <q-item-section>
            <q-item-label class="memo-item-text">{{ memo.text }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn
                size="10px"
                padding="12px"
                flat
                dense
                round
                icon="fa-solid fa-pen"
              />
              <q-btn
                size="10px"
                padding="12px"
                flat
                dense
                round
                icon="fa-solid fa-trash-can"
              />
              <q-btn
                size="10px"
                padding="12px"
                flat
                dense
                round
                icon="fa-solid fa-arrow-up-right-from-square"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

const contacts = [
  {
    id: 1,
    name: "Ruddy Jedrzej",
    email: "rjedrzej0@discuz.net",
    letter: "R",
  },
  {
    id: 2,
    name: "Mallorie Alessandrini",
    email: "malessandrini1@marketwatch.com",
    letter: "M",
  },
  {
    id: 3,
    name: "Elisabetta Wicklen",
    email: "ewicklen2@microsoft.com",
    letter: "E",
  },
  {
    id: 4,
    name: "Seka Fawdrey",
    email: "sfawdrey3@wired.com",
    letter: "S",
  },
];

export default defineComponent({
  name: "IndexPage",
  //   setup() {
  //     return {
  //       memoData,
  //     };
  //   },
  data() {
    return {
      memoData: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function () {
      // dummy source
      const result = {
        "https://www.google.com/finance/quote/7453:TYO?window=5Y": [
          {
            id: 1,
            bgColor: "rgb(244, 204, 204)",
            position: {
              left: 954,
              top: 583.0000305175781,
            },
            size: {
              h: 74,
              w: 200,
            },
            text: "期末配当金　毎年8月末日",
            textHtml:
              '<p><span style="color: rgb(51, 51, 51); font-family: 游ゴシック, YuGothic, &quot;Hiragino Kaku Gothic ProN&quot;, Helvetica, Meiryo, sans-serif; font-size: 14px;">期末配当金　毎年8月末日</span><br style="-webkit-font-smoothing: antialiased; box-sizing: border-box; color: rgb(51, 51, 51); font-family: 游ゴシック, YuGothic, &quot;Hiragino Kaku Gothic ProN&quot;, Helvetica, Meiryo, sans-serif; font-size: 14px;"><span style="color: rgb(51, 51, 51); font-family: 游ゴシック, YuGothic, &quot;Hiragino Kaku Gothic ProN&quot;, Helvetica, Meiryo, sans-serif; font-size: 14px;">中間配当金　毎年2月末日</span><br></p>',
          },
        ],
        "https://www.google.com/finance/quote/REIT:INDEXTYO": [
          {
            id: 2,
            bgColor: "rgb(252, 229, 205)",
            position: {
              left: 654,
              top: 328,
            },
            size: {
              h: 36,
              w: 143,
            },
            text: "2080で売る",
            textHtml: "<p>2080で売る</p>",
          },
        ],
      };

      // chrome.storage.sync.get(null, function (result) {
      // console.log(result);
      let index = 0;
      for (let key in result) {
        this.memoData.push({
          id: index,
          url: key,
          memoList: result[key],
        });
        index += 1;
      }
      // });
    },
  },
});
</script>
<style>
.list-header {
  width: 60%;
  margin: 40px auto 10px auto;
}
.list-body {
  width: 60%;
  margin: auto;
}
.memo-item-text {
  font-size: 16px;
}
</style>
