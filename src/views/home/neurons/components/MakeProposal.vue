<template>
  <a-modal
    v-model="visible"
    centered
    title="Make Proposal"
    width="1000px"
    :keyboard="false"
    :maskClosable="false"
    :after-close="afterClose"
    class="proposal-model"
  >
    <div class="maker-proposal-main">
      <div class="maker-proposal-item">
        <div
          class="maker-proposal-label base-font-title ant-form-item-required"
        >
          Neuron Id:
        </div>
        <a-select
          notFoundContent="Not eligible neurons"
          class="maker-proposal-item-neuron"
          v-model="neuronId"
        >
          <a-select-option
            v-for="(item, index) in neurons"
            :key="index"
            :value="item.id[0].id.toString()"
          >
            <span>{{ item.id[0].id.toString() }}</span>
          </a-select-option>
        </a-select>
      </div>
      <div class="maker-proposal-item">
        <div
          class="maker-proposal-label base-font-title ant-form-item-required"
        >
          Title:
        </div>
        <a-textarea
          v-model="title"
          autocomplete="off"
          placeholder="Proposal Title"
          :autoSize="{ minRows: 2 }"
        ></a-textarea>
      </div>
      <div class="maker-proposal-item">
        <div class="maker-proposal-label base-font-title">Url:</div>
        <a-textarea
          v-model="url"
          autocomplete="off"
          placeholder="The web address of additional content required to evaluate the proposal, specified using HTTPS."
          :autoSize="{ minRows: 2 }"
        ></a-textarea>
      </div>
      <div class="maker-proposal-item">
        <div
          class="maker-proposal-label base-font-title ant-form-item-required"
        >
          Action:
        </div>
        <div class="maker-proposal-item-action" ref="action"></div>
      </div>
      <div class="maker-proposal-item">
        <div class="maker-proposal-label base-font-title">Summary:</div>
        <mavon-editor
          v-model="summary"
          ref="md"
          language="en"
          :html="false"
          :xssOptions="false"
          :externalLink="false"
          :toolbars="toolbars"
        ></mavon-editor>
      </div>
    </div>
    <div slot="footer">
      <button
        type="button"
        class="primary w100 mt20 large-primary"
        @click="submit"
      >
        Make Proposal
      </button>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IDL, InputBox, renderInput } from '@dfinity/candid';
import { PrincipalClass, Type } from '@dfinity/candid/lib/cjs/idl';
import { getCandidInterfaceTmpHack } from '@/ic/getCandidInterfaceTmpHack';
import { hexToBytes } from '@/ic/converter';
import { checkAuth } from '@/ic/CheckAuth';
import { namespace } from 'vuex-class';
import BigNumber from 'bignumber.js';
import { Neuron, Proposal } from '@/ic/governance/model';
import { GovernanceService } from '@/ic/governance/governanceService';
import { GOVERNANCE_CANISTER_ID } from '@/ic/utils';
import { GovernanceError } from '@/ic/SNSGovernance/model';
import { Principal } from '@dfinity/principal/lib/cjs';

const commonModule = namespace('common');

@Component({
  name: 'MakeProposal',
  components: {}
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  private governanceService: GovernanceService;
  private visible = false;
  private actionParams: Type[] = null;
  private actionInput: InputBox = null;
  private summary = '';
  private title = '';
  private url = '';
  private neurons: Array<Neuron> = [];
  private neuronId = '';
  private externalLink = {
    markdown_css: function () {
      return '/markdown/github-markdown.min.css';
    },
    hljs_js: function () {
      return '/highlightjs/highlight.min.js';
    },
    hljs_css: function (css) {
      return '/highlightjs/styles/' + css + '.min.css';
    },
    hljs_lang: function (lang) {
      return '/highlightjs/languages/' + lang + '.min.js';
    },
    katex_css: function () {
      return '/katex/katex.min.css';
    },
    katex_js: function () {
      return '/katex/katex.min.js';
    }
  };
  private toolbars = {
    bold: true,
    italic: true,
    header: true,
    underline: true,
    strikethrough: true,
    mark: true,
    superscript: true,
    subscript: true,
    quote: true,
    ol: true,
    ul: true,
    link: true,
    imagelink: false,
    code: true,
    table: true,
    undo: true,
    redo: true,
    trash: true,
    save: true,
    alignleft: true,
    aligncenter: true,
    alignright: true,
    navigation: true,
    subfield: true,
    fullscreen: true,
    readmodel: true,
    htmlcode: true,
    help: true,
    preview: true
  };
  created(): void {
    this.governanceService = new GovernanceService();
  }
  private async submit(): Promise<void> {
    if (!this.neuronId) {
      this.$message.error('Please select a neuron');
      return;
    }
    if (!this.title) {
      this.$message.error('Please enter title');
      return;
    }
    let parse;
    try {
      parse = this.actionInput.parse();
    } catch (e) {
      console.log(e);
      this.$message.error('Please select action');
      return;
    }
    const actionInput = this.initBlobParams(parse);
    console.log(actionInput);
    console.log(this.summary);
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const proposal: Proposal = {
        title: [this.title],
        url: this.url,
        action: [actionInput],
        summary: this.summary
      };
      console.log(proposal);
      const res = await this.governanceService.makeProposal(
        BigInt(this.neuronId),
        proposal
      );
      console.log(res);
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          this.$message.error(err.error_message);
        } else {
          this.visible = false;
          this.$message.success('Make Proposal Success');
          this.$emit('makeProposalSuccess');
        }
      } else {
        this.$message.error('Error');
      }
    } catch (e) {
      console.log(e);
    }
    loading.close();
  }
  private initBlobParams(val: any): any {
    if (typeof val === 'object') {
      if (Object.prototype.toString.call(val) === '[object Object]') {
        let tmp = {};
        for (let key in val) {
          if (key === 'vec nat8 hex') {
            return hexToBytes(val[key]);
          }
          tmp[key] = this.initBlobParams(val[key]);
        }
        val = tmp;
        return val;
      } else if (Array.isArray(val)) {
        let tmp = [];
        for (let i = 0; i < val.length; i++) {
          if (val[i] && val[i]._isPrincipal) {
            tmp.push(val[i]);
          } else {
            tmp.push(this.initBlobParams(val[i]));
          }
        }
        val = tmp;
        return val;
      } else {
        return val;
      }
    } else {
      return val;
    }
  }
  private async init(): Promise<void> {
    this.getNeurons();
    const params = await getCandidInterfaceTmpHack(GOVERNANCE_CANISTER_ID);
    this.actionParams = params.manage_neuron.argTypes;
    console.log(this.actionParams);
    this.setParams(
      (this.actionParams[0] as any)._fields[1][1]._type._fields[8][1]._type
        ._fields[2][1]._type
    );
    this.actionInput = renderInput(
      (this.actionParams[0] as any)._fields[1][1]._type._fields[8][1]._type
        ._fields[2][1]._type
    );
    this.$nextTick(() => {
      this.actionInput.render(this.$refs.action as HTMLElement);
    });
  }
  private async getNeurons(): Promise<void> {
    const neuronIdList = await this.governanceService.getNeuronIds();
    const res = await this.governanceService.listNeurons({
      include_public_neurons_in_full_neurons: [false],
      include_empty_neurons_readable_by_caller: [false],
      neuron_ids: neuronIdList,
      include_neurons_readable_by_caller: false
    });
    console.log(res);
    if (res && res.full_neurons) {
      this.neurons = res.full_neurons.filter((neuron) => {
        const reject_cost_e8s = 10 * 10 ** 8;
        const balance = new BigNumber(
          neuron.cached_neuron_stake_e8s.toString(10)
        )
          .minus(neuron.neuron_fees_e8s.toString(10))
          .minus(reject_cost_e8s);
        let controller = '';
        if (neuron.controller && neuron.controller.length) {
          controller = neuron.controller[0].toString();
        }
        const dissolveState = neuron.dissolve_state;
        let dissolveDelay = 0;
        const type = Object.keys(dissolveState[0])[0];
        if (dissolveState[0]) {
          if (type === 'DissolveDelaySeconds') {
            const time = Object.values(dissolveState[0])[0] || BigInt(0);
            dissolveDelay = Number(time);
          } else {
            const now = Math.ceil(new Date().getTime() / 1000);
            const time = Object.values(dissolveState[0])[0] || BigInt(0);
            if (Number(time) - now >= 0) {
              dissolveDelay = Number(time) - now;
            } else {
              dissolveDelay = 0;
            }
          }
        }
        const SECONDS_IN_YEAR = ((4 * 365 + 1) * (60 * 60 * 24)) / 4;
        const minDissolveDelaySeconds = SECONDS_IN_YEAR / 2;
        return (
          controller === this.getPrincipalId &&
          balance.gte(0) &&
          new BigNumber(dissolveDelay).gte(minDissolveDelaySeconds)
        );
      });
    }
    console.log(this.neurons);
    if (this.neurons.length) {
      this.neuronId = this.neurons[0].id[0].id.toString();
    } else {
      this.neuronId = '';
    }
  }
  private setParams(idType: Type): Type {
    if (
      idType instanceof IDL.RecClass ||
      idType instanceof IDL.VecClass ||
      idType instanceof IDL.OptClass
    ) {
      if (idType instanceof IDL.VecClass) {
        if (
          idType['_type'] instanceof IDL.FixedNatClass &&
          idType['_type']._bits === 8
        ) {
          const obj = {};
          obj['vec nat8 hex'] = new IDL.TextClass();
          idType = new IDL.RecordClass(obj);
          return idType;
        }
      }
      let idlType;
      if (idType instanceof IDL.RecClass) {
        idlType = new IDL.RecClass();
      } else if (idType instanceof IDL.VecClass) {
        idlType = new IDL.VecClass(idType['_type']);
      } else if (idType instanceof IDL.OptClass) {
        idlType = new IDL.OptClass(idType['_type']);
      }
      idlType['_type'] = this.setParams(idType['_type']);
      idType['_type'] = idlType['_type'];
      return idType;
    } else if (
      idType instanceof IDL.RecordClass ||
      idType instanceof IDL.VariantClass ||
      idType instanceof IDL.TupleClass
    ) {
      let temp = [];
      for (let i = 0; i < idType['_fields'].length; i++) {
        let idlType;
        if (idType['_fields'][i][1] instanceof IDL.RecordClass) {
          idlType = this.setParams(idType['_fields'][i][1]) as any;
          idType['_fields'][i][1] = idlType;
        } else if (idType['_fields'][i][1] instanceof IDL.VariantClass) {
          idlType = this.setParams(idType['_fields'][i][1]);
          idType['_fields'][i][1] = idlType;
        } else {
          if (idType['_fields'][i][0] !== 'MakeProposal') {
            idType['_fields'][i][1] = this.setParams(idType['_fields'][i][1]);
          }
        }
        temp.push(idType['_fields'][i]);
      }
      idType['_fields'] = temp;
      return idType;
    } else {
      return idType;
    }
  }
  private afterClose(): void {
    this.neurons = [];
    this.neuronId = '';
    this.title = '';
    this.url = '';
    this.summary = '';
    (this.$refs.action as HTMLElement).innerHTML = '';
  }
}
</script>

<style scoped lang="scss">
.maker-proposal-item-neuron {
  width: 100%;
}
.proposal-model {
  ::v-deep {
    .ant-modal-footer {
      padding: 0 55px;
      border: none;
    }
    .ant-modal-body {
      max-height: calc(100vh - 240px);
    }
  }
}
.maker-proposal-item {
  margin-bottom: 20px;
}
.maker-proposal-label {
  margin-bottom: 10px;
  font-size: 16px;
}
.maker-proposal-item-action {
  ::v-deep > span {
    > span {
      padding-left: 10px;
      border-left: 1px solid #666;
    }
  }
  ::v-deep .popup-form {
    > span {
      > span {
        > span {
          padding-left: 10px;
          border-left: 1px solid #666;
        }
      }
    }
  }
  ::v-deep {
    span {
      display: block;
      margin-top: 5px;
      &.status {
        line-height: 1.2;
        color: #f5222d;
        font-size: 12px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        color: #666;
      }
      input {
        width: 100%;
        vertical-align: middle;
        padding-left: 11px;
      }
      input[type='checkbox'] {
        height: auto !important;
        width: auto;
      }
      /*input[placeholder='nat8'] {
				width: 20px;
			}*/
      select {
        width: 100%;
      }
    }
  }
}
</style>
