<template>
  <a-modal
    :after-close="afterClose"
    :keyboard="false"
    :maskClosable="false"
    centered
    class="proposal-model"
    title="Make Proposal"
    v-model="visible"
    width="1000px"
  >
    <div class="maker-proposal-main">
      <div class="maker-proposal-item">
        <div
          class="maker-proposal-label base-font-title ant-form-item-required"
        >
          Neuron Id:
        </div>
        <a-select
          class="maker-proposal-item-neuron"
          notFoundContent="Not eligible neurons"
          v-model="neuronId"
        >
          <a-select-option
            :key="index"
            :value="arrayToString(item.id[0].id)"
            v-for="(item, index) in SNSNeurons"
          >
            <span>{{ arrayToString(item.id[0].id) }}</span>
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
          :autoSize="{ minRows: 2 }"
          autocomplete="off"
          placeholder="Proposal Title"
          v-model="title"
        ></a-textarea>
      </div>
      <div class="maker-proposal-item">
        <div class="maker-proposal-label base-font-title">Url:</div>
        <a-textarea
          :autoSize="{ minRows: 2 }"
          autocomplete="off"
          placeholder="The web address of additional content required to evaluate the proposal, specified using HTTPS."
          v-model="url"
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
          :externalLink="false"
          :html="false"
          :toolbars="toolbars"
          :xssOptions="false"
          language="en"
          ref="md"
          v-model="summary"
        ></mavon-editor>
      </div>
    </div>
    <div slot="footer">
      <button
        @click="submit"
        class="primary w100 mt20 large-primary"
        type="button"
      >
        Make Proposal
      </button>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  NeuronPermissionEnum,
  proposalsNeurons
} from '@/views/home/ICSNS/model';
import { IDL, InputBox, renderInput } from '@dfinity/candid';
import { Type } from '@dfinity/candid/lib/cjs/idl';
import { getCandidInterfaceTmpHack } from '@/ic/getCandidInterfaceTmpHack';
import { hexToBytes, toHexString } from '@/ic/converter';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import { checkAuth } from '@/ic/CheckAuth';
import {
  GovernanceError,
  ListNeurons,
  Proposal,
  SNSNeuron
} from '@/ic/SNSGovernance/model';
import { Principal } from '@dfinity/principal';
import { namespace } from 'vuex-class';
import BigNumber from 'bignumber.js';
const commonModule = namespace('common');
@Component({
  name: 'MakerProposal',
  components: {}
})
export default class extends Vue {
  @commonModule.Getter('getPrincipalId') getPrincipalId?: string;
  @Prop({ type: Object, default: () => null })
  currentSNS!: proposalsNeurons;
  private visible = false;
  private actionParams: Type[] = null;
  private actionInput: InputBox = null;
  private summary = '';
  private title = '';
  private url = '';
  private SNSNeurons: Array<SNSNeuron> = [];
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
  private functionId: { [key: string]: number } = {};
  @Watch('actionInput', { deep: true })
  private onActionInput() {
    const labels = document.getElementsByTagName('label') as any;
    if (labels && labels.length) {
      labels.forEach((item) => {
        if (item.innerText === 'function_name') {
          const custom = document.querySelector('.custom-select');
          if (!custom) {
            const dom = document.createElement('div');
            const popup_form = document.querySelector('.popup-form');
            if (popup_form) {
              const firstChild: any =
                popup_form.firstElementChild || popup_form.firstChild;
              firstChild.style.display = 'none';
              popup_form.insertBefore(dom, popup_form.firstChild);
            }
            let newHtml =
              '<div style="margin-bottom: 5px">function_name</div><div class="custom-select"><div class="select-selected"><svg class="select-selected-icon" viewBox="64 64 896 896" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg></div><div class="select-items select-hide">';
            for (let key in this.functionId) {
              newHtml += `<div>${key}</div>`;
            }
            newHtml += '</div></div>';
            dom.outerHTML = newHtml;
            console.dir(dom);
            this.$nextTick(() => {
              const custom = document.querySelector('.popup-form select');
              const selected = document.querySelector('.select-selected');
              const items = document.querySelector('.select-items');
              selected.addEventListener('click', function () {
                items.classList.toggle('select-hide');
              });
              Array.from(items.children).forEach(function (item) {
                item.addEventListener('click', function () {
                  Array.from(items.children).forEach((el) =>
                    el.classList.remove('active')
                  );
                  item.classList.add('active');
                  console.dir(custom);
                  if (custom) {
                    for (let i = 0; i < (custom as any).options.length; i++) {
                      if (
                        (custom as any).options[i].value === this.textContent
                      ) {
                        (custom as any).selectedIndex = i;
                        custom.dispatchEvent(new Event('change'));
                        break;
                      }
                    }
                    // document.querySelector('.popup-form select').set
                    // (custom as any).value = this.textContent;
                  }
                  selected.innerHTML = this.textContent;
                  items.classList.add('select-hide');
                });
              });
              document.addEventListener('click', function (e) {
                if (e.target !== selected && e.target !== items) {
                  items.classList.add('select-hide');
                }
              });
            });
          }
        }
      });
    }
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
      this.$message.error('Please select action');
      return;
    }
    const actionInput = this.initBlobParams(parse);
    if (actionInput && actionInput.ExecuteGenericNervousSystemFunction) {
      if (
        actionInput.ExecuteGenericNervousSystemFunction.function_name &&
        actionInput.ExecuteGenericNervousSystemFunction.payload
      ) {
        actionInput.ExecuteGenericNervousSystemFunction = {
          function_id:
            this.functionId[
              Object.keys(
                actionInput.ExecuteGenericNervousSystemFunction.function_name
              )[0]
            ],
          payload: actionInput.ExecuteGenericNervousSystemFunction.payload
        };
      }
    }
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const proposal: Proposal = {
        title: this.title,
        url: this.url,
        action: [actionInput],
        summary: this.summary
      };
      const res = await snsGovernanceService.makerProposal(
        this.currentSNS.governanceId,
        Array.from(hexToBytes(this.neuronId)),
        proposal
      );
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          this.$message.error(err.error_message);
        } else {
          this.visible = false;
          this.$message.success('Make Proposal Success');
          this.$emit('makerProposalSuccess');
        }
      } else {
        this.$message.error('Make Proposal Error');
      }
    } catch (e) {}
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
    const params = await getCandidInterfaceTmpHack(
      this.currentSNS.governanceId
    );
    this.actionParams = params.manage_neuron.argTypes;
    (this.actionParams[0] as any)._fields[1][1]._type._fields.forEach(
      (param) => {
        if (param[0] === 'MakeProposal') {
          const _type = param[1]._fields[2][1]._type;
          if (_type && _type._fields && _type._fields.length) {
            _type._fields.some((item) => {
              if (item && item[0] === 'ExecuteGenericNervousSystemFunction') {
                if (
                  item[1] &&
                  item[1]._fields &&
                  item[1]._fields[0] &&
                  item[1]._fields[0][0] === 'function_id' &&
                  item[1]._fields[0][1] instanceof IDL.FixedNatClass &&
                  this.currentSNS &&
                  this.currentSNS.listTypes &&
                  this.currentSNS.listTypes.length
                ) {
                  const functionIds = {};
                  this.currentSNS.listTypes.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                  });
                  this.currentSNS.listTypes.forEach((item) => {
                    if (item.id >= 1000) {
                      this.functionId[item.name] = item.id;
                      functionIds[item.name] = new IDL.RecordClass();
                    }
                  });
                  const a = new IDL.VariantClass(functionIds);
                  item[1]._fields[0][0] = 'function_name';
                  item[1]._fields[0][1] = IDL.Variant(functionIds);
                }
                return true;
              }
            });
          }
          this.setParams(_type);
          this.actionInput = renderInput(_type);
          this.$nextTick(() => {
            this.actionInput.render(this.$refs.action as HTMLElement);
          });
        }
      }
    );
  }
  private async getNeurons(): Promise<void> {
    const snsGovernanceService = new SNSGovernanceService();
    const request: ListNeurons = {
      of_principal: [Principal.from(this.getPrincipalId)],
      limit: BigInt(100),
      start_page_at: []
    };
    const res = await snsGovernanceService.listSNSNeurons(
      this.currentSNS.governanceId,
      request
    );
    if (res) {
      this.SNSNeurons = this.filterNeuron(res.neurons);
    } else {
      this.SNSNeurons = [];
    }
    if (this.SNSNeurons.length) {
      this.neuronId = this.arrayToString(this.SNSNeurons[0].id[0].id);
    } else {
      this.neuronId = '';
    }
  }
  private getVotingPower(SNSNeuron: SNSNeuron): string {
    const dissolveState = SNSNeuron.dissolve_state;
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
    if (
      dissolveDelay === 0 ||
      new BigNumber(dissolveDelay).lt(
        this.currentSNS.nervousSystemParameters.neuron_minimum_dissolve_delay_to_vote_seconds[0].toString(
          10
        )
      )
    ) {
      return '0.00';
    }
    const dissolveDelayBonus = new BigNumber(dissolveDelay)
      .div(
        this.currentSNS.nervousSystemParameters.max_dissolve_delay_seconds[0].toString(
          10
        )
      )
      .times(
        this.currentSNS.nervousSystemParameters.max_dissolve_delay_bonus_percentage[0].toString(
          10
        )
      )
      .div(100)
      .plus(1);
    const now = new Date().getTime() / 1000;
    let aging = BigInt(
      parseInt(
        new BigNumber(now)
          .minus(SNSNeuron.aging_since_timestamp_seconds.toString(10))
          .toString(10)
      )
    );
    if (dissolveState[0]) {
      const type = Object.keys(dissolveState[0])[0];
      if (type === 'WhenDissolvedTimestampSeconds') {
        aging = BigInt(0);
      }
    }
    const ageBonus = new BigNumber(aging.toString(10))
      .div(
        this.currentSNS.nervousSystemParameters.max_neuron_age_for_age_bonus[0].toString(
          10
        )
      )
      .times(
        this.currentSNS.nervousSystemParameters.max_age_bonus_percentage[0].toString(
          10
        )
      )
      .div(100)
      .plus(1);
    const balance = this.getVoteBalance(SNSNeuron);
    return new BigNumber(balance)
      .times(dissolveDelayBonus)
      .times(ageBonus)
      .times(SNSNeuron.voting_power_percentage_multiplier.toString(10))
      .div(100)
      .decimalPlaces(2, 1)
      .toString(10);
  }
  private getVoteBalance(SNSNeuron: SNSNeuron): string {
    const staked_maturity_e8s_equivalent =
      SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    return new BigNumber(SNSNeuron.cached_neuron_stake_e8s.toString(10))
      .plus(staked_maturity_e8s_equivalent.toString(10))
      .div(10 ** this.currentSNS.decimals)
      .toString(10);
  }
  private canVote(SNSNeuron: SNSNeuron, type: number): boolean {
    let flag = false;
    for (let i = 0; i < SNSNeuron.permissions.length; i++) {
      const permissions = SNSNeuron.permissions[i];
      if (
        permissions &&
        permissions.principal[0].toString() === this.getPrincipalId
      ) {
        flag = permissions.permission_type.some((permission_type) => {
          return Number(permission_type) === type;
        });
        break;
      }
    }
    return flag;
  }
  private filterNeuron(SNSNeurons: Array<SNSNeuron>): Array<SNSNeuron> {
    SNSNeurons = SNSNeurons.filter((SNSNeuron) => {
      const votingPower = this.getVotingPower(SNSNeuron);
      return (
        this.canVote(SNSNeuron, NeuronPermissionEnum['SubmitProposal']) &&
        Number(votingPower) > 0 &&
        this.hasBalance(SNSNeuron)
      );
    });
    return SNSNeurons;
  }
  private hasBalance(SNSNeuron: SNSNeuron): boolean {
    // const staked_maturity_e8s_equivalent =
    //   SNSNeuron.staked_maturity_e8s_equivalent[0] || BigInt(0);
    return (
      new BigNumber(SNSNeuron.cached_neuron_stake_e8s.toString(10))
        // .plus(staked_maturity_e8s_equivalent.toString(10))
        .minus(SNSNeuron.neuron_fees_e8s.toString(10))
        .gte(
          this.currentSNS.nervousSystemParameters.reject_cost_e8s[0].toString(
            10
          )
        )
    );
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
          // if (idType['_fields'][i][1] instanceof IDL.TupleClass) {
          //   const type = [];
          //   types['_fields'].forEach((item) => {
          //     type.push(item[1]);
          //   });
          //   idlType = new IDL.TupleClass(type);
          // } else {
          //   idlType = new IDL.RecordClass();
          // }
          idlType = this.setParams(idType['_fields'][i][1]) as any;
          idType['_fields'][i][1] = idlType;
        } else if (idType['_fields'][i][1] instanceof IDL.VariantClass) {
          // idlType = new IDL.VariantClass();
          idlType = this.setParams(idType['_fields'][i][1]);
          idType['_fields'][i][1] = idlType;
        }
        // else if (idType['_fields'][i][1] instanceof IDL.TupleClass) {
        //   // idlType = new IDL.TupleClass();
        // }
        else {
          idType['_fields'][i][1] = this.setParams(idType['_fields'][i][1]);
        }
        temp.push(idType['_fields'][i]);
      }
      // if (idType instanceof IDL.VariantClass) {
      //   idType = new IDL.VariantClass(temp as any);
      // }
      idType['_fields'] = temp;
      return idType;
    } else {
      return idType;
    }
  }
  private afterClose(): void {
    this.SNSNeurons = [];
    this.neuronId = '';
    this.title = '';
    this.url = '';
    this.summary = '';
    (this.$refs.action as HTMLElement).innerHTML = '';
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
}
</script>
<style lang="scss" scoped>
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
      max-height: fit-content;
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
<style lang="scss">
.select-selected {
  display: flex;
  align-items: center;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  color: #fff;
  padding-left: 5px;
  background: #141b23;
  border: 1px solid #464648;
}
.custom-select {
  position: relative;
  z-index: 9999;
}
.select-items {
  position: absolute;
  max-height: 310px;
  right: 0;
  left: 0;
  color: #727a87;
  font-weight: 400;
  font-size: 14px;
  overflow-y: scroll;
  line-height: 22px;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  background: #141b23;
  box-shadow: 1px 2px 8px rgba(7, 7, 7, 0.5);
  transition: all 0.3s;
}
.select-hide {
  display: none;
}
.select-items {
  div {
    padding: 4px 16px;
    cursor: pointer;
    &:hover {
      background: #ffffff14;
      color: #51b7c3;
    }
    &.active {
      background: #ffffff14;
      color: #51b7c3;
    }
  }
}
.select-selected-icon {
  margin-left: auto;
  margin-right: 5px;
  font-size: 12px;
}
</style>
