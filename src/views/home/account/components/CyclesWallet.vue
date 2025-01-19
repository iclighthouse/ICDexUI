<template>
  <tr>
    <td class="padding10 pc-show base-text-color">
      <span>{{ wallet.name }}</span>
    </td>
    <td>
      <div class="wallet-id base-text-color">
        <copy-account
          :front="isH5 ? 2 : 8"
          :account="wallet.walletId.toString()"
          copyText="Cycles Wallet"
        ></copy-account
        ><a-icon v-if="wallet.isDefault" type="check-circle" />
        <a-tooltip placement="top">
          <template slot="title">
            The balance of Cycles Wallet is too low and its Canister is at risk
            of being frozen by IC, please increase Cycles. If you don't increase
            Cycles for a long time, the Cycles Wallet will be completely
            destroyed.
          </template>
          <a-icon
            class="exclamation-circle-warning"
            v-show="cyclesLow"
            type="exclamation-circle"
          />
        </a-tooltip>
      </div>
    </td>
    <td>
      <div class="cycles-balance-td">
        {{ cycles }}&nbsp;TCycles
        <!--<a-icon
          v-show="!refreshBalanceLoading"
          type="reload"
          class="reload-icon"
          @click="refreshCycles"
        />
        <a-icon
          v-show="refreshBalanceLoading"
          type="loading"
          class="reload-icon"
        />-->&nbsp;<svg
          @click="showTopUp"
          t="1636268757910"
          class="icon pc-show"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="7334"
          width="16"
          height="18"
          style="cursor: pointer"
        >
          <path
            d="M929.1 637.6c-16.1-36-10.4-73.2-4.9-109.1 8.5-55.6 18.8-123.7-69.7-163.5 5.9-21.2 5.4-45.6-12.5-54.2l-105.3-50.7c-23-11.1-83-8.7-90.1 5.9-7 14.6-26.4 45 22.8 56.3s95 68.9 95 68.9c16.5 16.1 35.5 25.7 50.4 25.9 59 20.7 55.7 44.9 47 101.8-6.3 40.7-14 91.5 9.7 144.5 32 71.4 33.9 113.4 6.3 140.4-33.8 33.3-79.5 22.7-108.3 3.6-38.9-25.8-39.5-73.5-36-149.1 2-42.8 4.1-87-8.5-124.7C696.9 450 611 449 607 449h-38.2V164.9c0-17.4-14.2-31.6-31.6-31.6H158.7c-17.3 0-31.6 14.2-31.6 31.6v662.6H95.6s-31.6 0-31.6 31.6v31.6h568.2v-31.6s0-31.6-31.6-31.6H569V512h37.9c4.6 0.1 45.2 2 58.5 41.6 8.9 26.5 7.1 63 5.3 101.7-3.5 73.7-7.4 157.2 64.1 204.6 28.7 19 60 28.4 90.3 28.4 35.9 0 70.4-13.3 97.1-39.5 70.4-69.2 24.2-172.3 6.9-211.2zM785.4 376c-8.7 0-15.8-7.1-15.8-15.8 0-8.7 7.1-15.8 15.8-15.8s15.8 7.1 15.8 15.8-7 15.8-15.8 15.8z m-279.7 41.3c0 17.3-14.2 31.6-31.6 31.6H221.8c-17.3 0-31.6-14.2-31.6-31.6V228c0-17.3 14.2-31.6 31.6-31.6h252.4c17.3 0 31.6 14.2 31.6 31.6v189.3h-0.1z"
            p-id="7335"
            fill="#e7eaf1"
          ></path>
        </svg>
      </div>
    </td>
    <td class="operation-td">
      <div class="operation">
        <span class="operation-name pc-show" @click="showSendCycles">
          Send cycles
        </span>
        <a-dropdown
          :trigger="['click']"
          overlayClassName="operation-dropdown"
          placement="bottomCenter"
        >
          <div class="operation-name">
            Operation<a-icon type="caret-down" />
          </div>
          <a-menu slot="overlay">
            <a-menu-item @click="showSendCycles"
              ><a-icon type="arrow-up" />Send cycles
            </a-menu-item>
            <a-menu-item @click="showEvents"
              ><a-icon type="calendar" />Events</a-menu-item
            >
            <a-menu-item @click="setDefault" v-if="!wallet.isDefault">
              <a-icon type="check-circle" />Set default
            </a-menu-item>
            <a-menu-item @click="onCyclesController('add')"
              ><a-icon type="plus" />Add controller</a-menu-item
            >
            <a-menu-item @click="onCyclesController('remove')"
              ><a-icon type="minus" />Remove controller</a-menu-item
            >
            <a-menu-item v-if="!wallet.isDefault" @click="onRemoveWallet"
              ><a-icon type="delete" />Remove wallet</a-menu-item
            >
            <a-menu-item @click="walletCallModal = true"
              ><a-icon type="export" />Wallet call</a-menu-item
            >
            <a-menu-item @click="onWalletName">
              <a-icon type="edit" />Set wallet name
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </td>
    <a-modal
      v-model="nameModal"
      width="550px"
      title="Set wallet name"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="name-modal"
      :after-close="afterClose"
    >
      <a-form-model :model="form" ref="form" :rules="formRules">
        <a-form-model-item label="Wallet name" prop="name">
          <a-input
            v-model="form.name"
            autocomplete="off"
            placeholder="wallet name"
            type="text"
          />
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            @click="setWalletName"
            class="w100 mt20 primary transfer-submit large-primary"
          >
            Set wallet name
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      v-model="eventsModal"
      width="80%"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="events-modal"
    >
      <a-table
        :locale="{
          emptyText: 'No events'
        }"
        :showHeader="false"
        :columns="columns"
        :data-source="events"
        :pagination="page"
        :loading="loading"
        rowKey="id"
      >
      </a-table>
    </a-modal>
    <wallet-send-cycles
      :cycles="cycles"
      ref="walletSendCycles"
      @sendCyclesSuccess="sendCyclesSuccess"
    ></wallet-send-cycles>
    <a-modal
      v-model="removeVisible"
      width="400px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :closable="false"
      class="delete-modal"
    >
      <p>Are your sure remove this cycles wallet?</p>
      <div class="delete-button">
        <button type="button" @click="removeVisible = false">Cancel</button>
        <button type="button" class="default" @click="removeWallet">
          Confirm
        </button>
      </div>
    </a-modal>
    <a-modal
      v-model="cyclesControllerModal"
      width="600px"
      :title="cyclesController"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="cycles-controller-modal"
      :after-close="afterCloseCyclesController"
    >
      <div>controllers: <span v-show="!walletControllers.length">-</span></div>
      <ul>
        <li v-for="(controller, index) in walletControllers" :key="index">
          <!--<copy-account
            :front="8"
            :account="controller.toString()"
            copyText="Principal ID"
          ></copy-account>-->
          {{ controller.toString() }}
        </li>
      </ul>
      <a-form-model
        :model="cyclesControllerForm"
        ref="cyclesControllerForm"
        :rules="cyclesControllerFormRules"
      >
        <a-form-model-item label="Controller" prop="controller">
          <a-input
            v-model="cyclesControllerForm.controller"
            autocomplete="off"
            placeholder="Canister ID(Principal)"
            type="text"
          />
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            @click="setController"
            class="w100 mt20 primary transfer-submit large-primary"
          >
            {{ cyclesController }}
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      v-model="walletCallModal"
      width="600px"
      title="Wallet call"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="wallet-call-modal"
      :after-close="walletCallAfterClose"
    >
      <a-form-model
        :model="walletCallForm"
        ref="walletCallForm"
        :rules="walletCallFormRules"
      >
        <a-form-model-item label="Canister" prop="canister">
          <a-input
            v-model="walletCallForm.canister"
            autocomplete="off"
            placeholder="Canister ID(Principal)"
            type="text"
          />
        </a-form-model-item>
        <a-form-model-item label="Method name" prop="methodName">
          <a-input
            v-model="walletCallForm.methodName"
            autocomplete="off"
            placeholder="methods name"
            type="text"
          />
        </a-form-model-item>
        <a-popover trigger="click" placement="bottomRight">
          <template slot="content" class="operation-popover">
            <div>
              <div>Use didc to encode the params as a hex:</div>
              <a
                href="https://github.com/dfinity/candid/tree/master/tools/didc"
                target="_blank"
                rel="nofollow noreferrer noopener"
                style="color: #1996c4"
                >https://github.com/dfinity/candid/tree/master/tools/didc</a
              >
            </div>
          </template>
          <div class="question-main">
            How to convert args to hex<a-icon
              class="question-circle-icon"
              type="question-circle"
            />
          </div>
        </a-popover>
        <a-form-model-item label="Args" prop="args">
          <a-textarea
            v-model="walletCallForm.args"
            autocomplete="off"
            placeholder="Specifies hex format"
            :autoSize="{ minRows: 2 }"
          ></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="Cycles" prop="cycles">
          <a-input
            class="input-cycles-suffix"
            v-model="walletCallForm.cycles"
            autocomplete="off"
            type="text"
            v-only-float="12"
            min="0"
            placeholder="0.00"
            suffix="TCycles"
          />
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            class="w100 mt20 primary large-primary"
            @click="walletCall"
          >
            Wallet call
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </tr>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Identity } from '@dfinity/agent';
import { WalletService } from '@/ic/wallet/walletService';
import BigNumber from 'bignumber.js';
import CreateWallet from '@/views/home/account/components/CreateWallet.vue';
import WalletSendCycles from '@/components/walletSendCycles/Index.vue';
import {
  EventKind,
  EventType,
  WalletCallRequest,
  WalletEvent
} from '@/ic/wallet/model';
import { formatDateToSecondUTC } from '@/ic/converter';
import { ManageWalletResponse } from '@/ic/ICLighthouse/model';
import { ICLighthouseService } from '@/ic/ICLighthouse/ICLighthouseService';
import { Principal } from '@dfinity/principal';
import { checkAuth } from '@/ic/CheckAuth';
import { toHttpError } from '@/ic/httpError';
import { validateCanister } from '@/utils/validate';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import { hexToBytes } from '@/ic/converter';
import { namespace } from 'vuex-class';
import { removeWhitelist } from '@/ic/ConnectPlug';
import { readState } from '@/ic/readState';
import { isSigner } from '@/ic/isSigner';
const commonModule = namespace('common');
@Component({
  name: 'CyclesWallet',
  components: {
    CreateWallet,
    WalletSendCycles
  }
})
export default class extends Vue {
  @commonModule.Getter('getCheckAuth') getCheckAuth?: boolean;
  $refs!: {
    form;
    walletCallForm;
    cyclesControllerForm;
    createWallet: HTMLFormElement;
    walletSendCycles: HTMLFormElement;
  };
  @Prop()
  public wallet!: ManageWalletResponse;
  public walletService: WalletService | undefined;
  public cycles = '-';
  public decimals = 8;
  public fee = 0.0001;
  private ICLighthouseService: ICLighthouseService;
  private timer = null;
  private walletCallModal = false;
  private walletCallForm = {
    args: '',
    cycles: '',
    methodName: '',
    canister: ''
  };
  private walletCallFormRules = {
    args: [{ required: true, message: 'Please enter params', trigger: 'blur' }],
    cycles: [
      { required: true, message: 'Please enter cycles', trigger: 'blur' },
      { validator: this.validateAmount, trigger: 'blur' }
    ],
    methodName: [
      { required: true, message: 'Please enter method name', trigger: 'blur' }
    ],
    canister: [
      { required: true, message: 'Please enter Canister', trigger: 'blur' },
      { validator: validateCanister, trigger: 'blur' }
    ]
  };
  private validateAmount(
    rule: ValidationRule,
    value: number,
    callback: (arg0?: string) => void
  ): void {
    if (value && new BigNumber(this.cycles).lt(value)) {
      callback('Insufficient cycles');
    } else {
      callback();
    }
  }
  private eventsModal = false;
  private nameModal = false;
  private removeVisible = false;
  private form = {
    name: ''
  };
  private formRules = {
    name: [
      { required: true, message: 'Please enter wallet name', trigger: 'blur' }
    ]
  };
  private cyclesControllerModal = false;
  private isH5 = false;
  private cyclesController = '';
  private cyclesControllerForm = {
    controller: ''
  };
  private cyclesControllerFormRules = {
    controller: [
      { required: true, message: 'Please enter Canister', trigger: 'blur' },
      { validator: validateCanister, trigger: 'blur' }
    ]
  };
  private events: Array<WalletEvent> = [];
  private page = {
    current: 1,
    pageSize: 10,
    total: 0,
    onChange: this.pageChange
  };
  private columns = [
    // {
    //   title: 'No',
    //   align: 'center',
    //   customRender: (text: string, record: Transaction, index: number) => {
    //     return (this.page.current - 1) * this.page.pageSize + index + 1;
    //   }
    // },
    {
      title: 'No',
      dataIndex: 'id'
    },
    {
      title: 'Event',
      dataIndex: 'kind',
      customRender: (text: EventKind): string => {
        let event = Object.keys(text)[0] as EventType;
        if (event === 'CyclesReceived') {
          // const amount = new BigNumber(text[event].amount)
          //   .div(10 ** 12)
          //   .decimalPlaces(4, 1);
          event += `: { from: ${text[event].from.toString()}, cycles: ${text[
            event
          ].amount.toString(10)} Cycles }`;
        } else if (event === 'CanisterCreated') {
          // const cycles = new BigNumber(text[event].cycles)
          //   .div(10 ** 12)
          //   .decimalPlaces(4, 1);
          event += `: { canister: ${text[
            event
          ].canister.toString()}, cycles: ${text[event].cycles.toString(
            10
          )} Cycles }`;
        } else if (event === 'CanisterCalled') {
          // const cycles = new BigNumber(text[event].cycles)
          //   .div(10 ** 12)
          //   .decimalPlaces(4, 1);
          event += `: { canister: ${text[
            event
          ].canister.toString()}, method_name: ${
            text[event].method_name
          }, cycles: ${text[event].cycles.toString(10)} Cycles }`;
        } else if (event === 'CyclesSent') {
          // const cycles = new BigNumber(text[event].amount)
          //   .div(10 ** 12)
          //   .decimalPlaces(4, 1);
          // const refund = new BigNumber(text[event].refund)
          //   .div(10 ** 12)
          //   .decimalPlaces(4, 1);
          event += `: { to: ${text[event].to.toString()}, cycles: ${text[
            event
          ].amount.toString(10)} Cycles , refund: ${text[event].refund.toString(
            10
          )} Cycles }`;
        } else if (event === 'AddressRemoved') {
          event += `: { id: ${text[event].id.toString()} }`;
        } else if (event === 'WalletDeployed') {
          event += `: { canister: ${text[event].canister.toString()} }`;
        } else if (event === 'AddressAdded') {
          const name = text[event].name.join(',');
          if (name) {
            event += `: { id: ${text[
              event
            ].id.toString()}, name: ${name}, role: ${
              Object.keys(text[event].role)[0]
            } }`;
          } else {
            event += `: { id: ${text[event].id.toString()}, role: ${
              Object.keys(text[event].role)[0]
            } }`;
          }
        }
        return event;
      }
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      width: 175,
      customRender: (text: bigint): string => {
        const timestamp = new Date(
          Number(new BigNumber(text.toString(10)).div(1000000))
        );
        return formatDateToSecondUTC(timestamp);
      }
    }
  ];
  private loading = false;
  private walletControllers: Array<Principal> = [];
  get cyclesLow(): boolean {
    let flag = false;
    if (this.cycles && this.cycles !== '-') {
      if (new BigNumber(this.cycles).lt(0.01)) {
        flag = true;
      }
    }
    return flag;
  }
  beforeDestroy(): void {
    window.clearInterval(this.timer);
    this.timer = null;
  }
  created(): void {
    this.walletService = new WalletService();
    this.ICLighthouseService = new ICLighthouseService();
    const width = document.documentElement.clientWidth;
    this.isH5 = width <= 768;
    this.init();
    this.getCyclesWalletBalance();
  }
  private init(): void {
    this.getWalletBalance();
    this.getWalletName();
  }
  private walletCallAfterClose(): void {
    this.$refs.walletCallForm.resetFields();
  }
  private async walletCall(): Promise<void> {
    this.$refs.walletCallForm.validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        try {
          // const walletCallRequest: WalletCallRequest = {};
          // const res = await this.walletService.walletCall(
          //   walletCallRequest,
          //   this.wallet.walletId.toString()
          // );
          const args = hexToBytes(this.walletCallForm.args);
          const walletSendRequest: WalletCallRequest = {
            args: Array.from(Buffer.from(args)),
            cycles: BigInt(
              new BigNumber(this.walletCallForm.cycles)
                .times(10 ** 12)
                .toString(10)
            ),
            method_name: this.walletCallForm.methodName,
            canister: Principal.fromText(this.walletCallForm.canister)
          };
          const res = await this.walletService.walletCall(
            walletSendRequest,
            this.wallet.walletId.toString()
          );
          console.dir(res);
          loading.close();
          if ((res as { Err: string }).Err) {
            this.$message.error((res as { Err: string }).Err);
          } else {
            this.$message.success('Success');
            this.walletCallModal = false;
          }
        } catch (e) {
          loading.close();
          this.$message.error(toHttpError(e).message);
        }
      }
    });
  }
  private showTopUp(): void {
    this.$emit('showTopUp', this.wallet.walletId.toString());
  }
  private setController(): void {
    this.$refs.cyclesControllerForm.validate(async (valid: any) => {
      if (valid) {
        if (this.cyclesController === 'Add Controller') {
          this.addController();
        } else {
          this.removeController();
        }
      }
    });
  }
  private async removeController(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const res = await this.walletService.removeControllers(
        this.wallet.walletId.toString(),
        Principal.fromText(this.cyclesControllerForm.controller)
      );
      loading.close();
      if ((res as { Ok: null }).Ok === null) {
        this.$message.success('remove Success success');
        this.cyclesControllerModal = false;
      } else {
        this.$message.error((res as { Err: string }).Err);
      }
    } catch (e) {
      loading.close();
      this.$message.error(toHttpError(e).message);
    }
  }
  private async addController(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      await this.walletService.addControllers(
        this.wallet.walletId.toString(),
        Principal.fromText(this.cyclesControllerForm.controller)
      );
      loading.close();
      this.$message.success('Add controller Success');
      this.cyclesControllerModal = false;
    } catch (e) {
      loading.close();
      this.$message.error(toHttpError(e).message);
    }
  }
  private async getControllers(): Promise<void> {
    this.walletControllers = await this.walletService.getControllers(
      this.wallet.walletId.toString()
    );
  }
  private onCyclesController(type: string) {
    if (type === 'add') {
      this.cyclesController = 'Add Controller';
    } else {
      this.cyclesController = 'Remove Controller';
    }
    this.getControllers();
    this.cyclesControllerModal = true;
  }
  private onRemoveWallet(): void {
    this.removeVisible = true;
  }
  private async removeWallet(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const flag = await this.ICLighthouseService.manageWallet(
        this.wallet.walletId,
        {
          del: null
        }
      );
      loading.close();
      if (flag) {
        this.$message.success('Success');
        this.$emit('removeWalletSuccess');
        removeWhitelist(this.wallet.walletId.toString());
      }
    } catch (e) {
      loading.close();
    }
    this.removeVisible = false;
  }
  private pageChange(page: number): void {
    this.page.current = page;
    this.getEvents();
  }
  private afterCloseCyclesController(): void {
    this.walletControllers = [];
    this.$refs.cyclesControllerForm.resetFields();
  }
  private afterClose(): void {
    this.$refs.form.resetFields();
  }
  private async getEvents(): Promise<void> {
    try {
      let from = this.page.total - this.page.current * this.page.pageSize;
      from = Math.max(from, 0);
      let to = this.page.total - (this.page.current - 1) * this.page.pageSize;
      this.events = await this.walletService.getEvents(
        this.wallet.walletId.toString(),
        [{ to: [to], from: [from] }]
      );
      this.events = this.events.slice().reverse();
    } catch (e) {
    }
    this.loading = false;
  }
  private async getEventTotal(): Promise<void> {
    try {
      const events = await this.walletService.getEvents(
        this.wallet.walletId.toString()
      );
      if (events.length) {
        this.page.total = events[events.length - 1].id + 1;
      }
    } catch (e) {
      // this.$message.error(toHttpError(e).message);
    }
  }
  private getCyclesWalletBalance(): void {
    this.timer = window.setInterval(() => {
      setTimeout(async () => {
        if (this.getCheckAuth) {
          if (this.$route.name === 'Account' && !isSigner()) {
            this.getWalletBalance();
          }
        }
      }, 0);
    }, 30 * 1000);
  }
  private async sendCyclesSuccess(): Promise<void> {
    await this.getWalletBalance();
    this.$refs.walletSendCycles.cycles = this.cycles;
  }
  private async showEvents(): Promise<void> {
    this.page.current = 1;
    this.page.total = 0;
    this.events = [];
    this.eventsModal = true;
    this.loading = true;
    await this.getEventTotal();
    await this.getEvents();
  }
  private async setDefault(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const flag = await this.ICLighthouseService.manageWallet(
        this.wallet.walletId,
        {
          setDefault: null
        }
      );
      loading.close();
      if (flag) {
        this.$message.success('Success');
        this.$emit('setDefaultSuccess');
      }
    } catch (e) {
      loading.close();
    }
  }
  private showSendCycles(): void {
    this.$refs.walletSendCycles.walletId = this.wallet.walletId.toString();
    // this.$refs.walletSendCycles.cycles = this.cycles;
    this.$refs.walletSendCycles.visible = true;
  }
  public initWallet(): void {
    // this.walletId = walletId;
    this.getWalletBalance();
  }
  public async getWalletBalance(): Promise<void> {
    try {
      const res = await this.walletService.getWalletBalance(
        this.wallet.walletId.toString()
      );
      this.cycles = new BigNumber(res.amount.toString(10))
        .div(10 ** 12)
        .decimalPlaces(this.isH5 ? 2 : 4, 1)
        .toString(10);
      this.wallet.cycles = this.cycles;
    } catch (e) {
      this.cycles = '-';
      this.wallet.cycles = '-';
      let state;
      try {
        state = await readState(this.wallet.walletId.toString());
      } catch (err) {
      }
      if (!state || (state && !state.moduleHash)) {
        const flag = await this.ICLighthouseService.manageWallet(
          this.wallet.walletId,
          {
            del: null
          }
        );
        if (flag) {
          this.$emit('removeWalletSuccess');
          removeWhitelist(this.wallet.walletId.toString());
        }
      }
    }
  }
  private onWalletName(): void {
    this.form.name = this.wallet.name;
    this.nameModal = true;
  }
  private async setWalletName(): Promise<void> {
    this.$refs.form.validate(async (valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.5)'
        });
        await checkAuth();
        try {
          await this.walletService.setWalletName(
            this.wallet.walletId.toString(),
            this.form.name
          );
          loading.close();
          this.nameModal = false;
          this.getWalletName();
          this.$message.success('set wallet name Success');
        } catch (e) {
          this.$message.error(toHttpError(e).message);
          loading.close();
        }
      }
    });
  }
  private async getWalletName(): Promise<void> {
    this.wallet.name = '';
    try {
      const name = await this.walletService.getWalletName(
        this.wallet.walletId.toString()
      );
      if (name) {
        this.wallet.name = name[0];
        this.$forceUpdate();
      }
    } catch (e) {
    }
  }
  public async onCreateWallet(): Promise<void> {
    this.getWalletBalance();
    this.$refs.createWallet.visible = true;
  }
}
</script>
<style scoped lang="scss">
.balance-main {
  width: 400px;
  height: 160px;
  background: #141b23;
  color: #727a87;
  margin: 0 20px 20px 0;
  p {
    display: flex;
    align-items: center;
    span {
      margin-left: auto;
      cursor: pointer;
    }
  }
  .balance {
    color: #bababa;
  }
}
.operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 10px;
  button {
    i {
      margin-right: 5px;
    }
    &.transfer {
      color: #c5594a;
      border-color: #c5594a;
      i {
        font-size: 15px;
        transform: rotate(45deg);
        transform-origin: 10px 10px;
      }
    }
  }
}
.cycles-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    margin-left: auto;
    font-size: 14px;
    .reload-icon {
      font-size: 12px;
      margin-right: 5px;
    }
  }
}
td {
  min-width: 25%;
  &.operation-td {
    display: flex;
    align-items: center;
    .operation {
      width: 100%;
    }
    .operation-name {
      margin-right: 10px;
      cursor: pointer;
      padding: 5px 0;
      i {
        font-size: 12px;
      }
    }
    .operation {
      color: #1996c4;
      i {
        margin-right: 0;
      }
    }
  }
}
.wallet-i {
  padding: 2px 0;
}
.arrow-up-icon {
  font-size: 16px !important;
}
.edit-name {
  cursor: pointer;
  padding-left: 5px;
}
.cycles-controller-modal {
  ul {
    margin-bottom: 20px;
  }
  li {
    font-size: 12px;
  }
}
.question-main {
  position: relative;
  bottom: -30px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  i {
    cursor: pointer;
    margin-left: 5px;
  }
}
.operation-popover {
  li {
    cursor: pointer;
  }
}
.cycles-balance-td {
  display: flex;
  align-items: center;
  .reload-icon {
    margin: 0 5px;
  }
  button {
    height: 26px;
  }
}
.wallet-id {
  display: flex;
  align-items: center;
  i {
    margin-left: 5px;
  }
}
.exclamation-circle-warning {
  color: #faad14;
}
@media screen and (max-width: 768px) {
  td {
    white-space: nowrap;
  }
  .pc-show {
    display: none;
  }
}
</style>
