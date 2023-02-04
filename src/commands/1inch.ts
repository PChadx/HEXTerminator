import { Telegraf, Context } from 'telegraf'
import { strings } from '@helpers/strings'
import { checkLock } from '@middlewares/checkLock'
import { clarifyIfPrivateMessages } from '@helpers/clarifyIfPrivateMessages'

export function setupPulseChainInfo(bot: Telegraf<Context>) {
 // bot.command([''], sendInfo)
 // disabling this command for now
}

export function sendInfo(ctx: Context) {
  if (ctx.update.message?.date) {
    console.log(
      'Replying to PulseChainInfo',
      Date.now() / 1000 - ctx.update.message?.date
    )
  }

  const aboutPulseChain = strings(ctx.dbchat, 'PulseChainInfo');
  const link =
      '[PulseChain Network](http://PulseChain.com)';

  return ctx.replyWithMarkdown(`${aboutPulseChain}\n\n${link}`, {
    disable_web_page_preview: false,
  })
}
