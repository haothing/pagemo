<template>
  <q-page class="container">
    <div class="list-header text-body1">
      <p>
        {{ msg.locale.options_title1 }}
      </p>
      <p>
        {{ msg.locale.options_title2 }}
      </p>
    </div>
    <q-list
      bordered
      separator
      class="list-body"
      v-for="item in memoData"
      :key="item.id"
    >
      <q-item class="memo-url bg-primary">
        <q-item-section>
          <q-item-label class="text-h5 text-grey-1">{{
            item.title
          }}</q-item-label>
          <q-item-label class="text-grey-4" caption>{{
            item.url
          }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="text-grey-1 q-gutter-xs text-subtitle1">
            <q-btn
              size="10px"
              padding="12px"
              flat
              dense
              round
              icon="fa-solid fa-arrow-up-right-from-square"
              @click="openSite(item.url)"
            />
            <q-btn
              size="10px"
              padding="12px"
              flat
              dense
              round
              icon="fa-solid fa-trash-can"
              @click="deleteMemo(item.id)"
            />
          </div>
        </q-item-section>
      </q-item>

      <q-item v-for="memo in item.memoList" :key="memo.id">
        <q-separator inset />
        <q-item-section>
          <q-item-label class="memo-item-text text-body2">{{
            memo.text
          }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn
              size="10px"
              padding="12px"
              flat
              dense
              round
              icon="fa-solid fa-trash-can"
              @click="deleteMemo(item.id, memo.id)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import msg from "src/i18n";

export default defineComponent({
  name: "IndexPage",
  setup() {
    return { msg };
  },
  data() {
    return {
      memoData: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    get: function (v, f) {
      // dummy source
      const result = {
        "https://www.google.com/finance/quote/7453:TYO?window=5Y": {
          title: "my site one",
          memoList: [
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
            {
              id: 2,
              bgColor: "rgb(244, 204, 204)",
              position: {
                left: 954,
                top: 583.0000305175781,
              },
              size: {
                h: 74,
                w: 200,
              },
              text: "期末1111",
              textHtml:
                '<p><span style="color: rgb(51, 51, 51); font-family: 游ゴシック, YuGothic, &quot;Hiragino Kaku Gothic ProN&quot;, Helvetica, Meiryo, sans-serif; font-size: 14px;">期末配当金　毎年8月末日</span><br style="-webkit-font-smoothing: antialiased; box-sizing: border-box; color: rgb(51, 51, 51); font-family: 游ゴシック, YuGothic, &quot;Hiragino Kaku Gothic ProN&quot;, Helvetica, Meiryo, sans-serif; font-size: 14px;"><span style="color: rgb(51, 51, 51); font-family: 游ゴシック, YuGothic, &quot;Hiragino Kaku Gothic ProN&quot;, Helvetica, Meiryo, sans-serif; font-size: 14px;">中間配当金　毎年2月末日</span><br></p>',
            },
          ],
        },
        "https://www.google.com/finance/quote/REIT:INDEXTYO": {
          title: "my site two",
          memoList: [
            {
              id: 1,
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
        },
      };

      f(result);
    },
    init: function () {
      if (chrome == null || chrome.storage == null) {
        var chrome = { storage: { sync: { get: this.get } } };
      }
      chrome.storage.sync.get(null, (result) => {
        let memoData = [];
        let index = 0;
        for (let key in result) {
          memoData.push({
            id: index,
            url: key,
            title: result[key]["title"],
            memoList: result[key]["memoList"],
          });
          index += 1;
        }
        this.memoData = memoData;
      });
    },
    openSite: function (url) {
      window.open(url);
    },
    deleteMemo: function (itemId, memoId) {
      if (chrome == null || chrome.storage == null) {
        var chrome = { storage: { sync: { get: this.get } } };
      }
      let memoData = this.memoData;
      chrome.storage.sync.get(null, (result) => {
        if (memoId != null) {
          for (let i = 0; i < memoData.length; i++) {
            if (memoData[i].id == itemId) {
              for (let j = 0; j < memoData[i].memoList.length; j++) {
                if (memoData[i].memoList[j].id == memoId) {
                  // delete memo from chrome storage
                  result[memoData[i].url].memoList.splice(j, 1);
                  if (result[memoData[i].url].memoList.length == 0) {
                    chrome.storage.sync.remove([memoData[i].url]);
                    // delete memo from local var
                    memoData.splice(i, 1);
                  } else {
                    chrome.storage.sync.set({
                      [memoData[i].url]: result[memoData[i].url],
                    });
                    // delete memo from local var
                    memoData[i].memoList.splice(j, 1);
                  }
                }
              }
            }
          }
        } else {
          for (let i = 0; i < memoData.length; i++) {
            if (memoData[i].id == itemId) {
              // delete memo from chrome storage
              chrome.storage.sync.remove([memoData[i].url]);
              // delete memo from local var
              memoData.splice(i, 1);
            }
          }
        }
      });
    },
  },
});
</script>
<style>
.list-header {
  width: 60%;
  margin: 40px auto 10px auto;
  font-family: "Arial", -apple-system, Ubuntu, "メイリオ", "ＭＳ Ｐゴシック",
    "Microsoft YaHei", "DengXian";
}
.list-body {
  width: 60%;
  margin: auto;
}
.memo-url {
}
.memo-item-text {
  font-size: 16px;
}
</style>
