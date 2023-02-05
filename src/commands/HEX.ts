import { Telegraf, Context } from 'telegraf'
import { strings } from '@helpers/strings'
import { checkLock } from '@middlewares/checkLock'
import { clarifyIfPrivateMessages } from '@helpers/clarifyIfPrivateMessages'

export function setupHEXInfo(bot: Telegraf<Context>) {
 // bot.command([''], sendInfo)
 // disabling this command for now
}

export function sendInfo(ctx: Context) {
  if (ctx.update.message?.date) {
    console.log(
      'Replying to HEXInfo',
      Date.now() / 1000 - ctx.update.message?.date
    )
  }

  const aboutHEX = strings(ctx.dbchat, 'HEXInfo');
  const link =
      '[Supported by HEX Community](http://HEX.com)';

  return ctx.replyWithMarkdown(`${aboutHEX}\n\n${link}`, {
    disable_web_page_preview: false,
  })
}
