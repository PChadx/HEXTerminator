import {
  deleteMessageSafe,
  deleteMessageSafeWithBot,
} from '@helpers/deleteMessageSafe'
import { addVerifiedUser } from '@models/VerifiedUser'
import { greetUser } from '@helpers/newcomers/greetUser'
import { modifyCandidates } from '@helpers/candidates'
import { CaptchaType } from '@models/Chat'

function MessageHasLink(ctx) {

  const linkRegex = /(https?:\/\/[^\s]+)|(\.)/g;

  if (linkRegex.test(ctx.message.text)) {
    if (ctx.dbchat.strict) {
      deleteMessageSafe(ctx);
      ctx.telegram.kickChatMember(ctx.chat.id, ctx.from.id);
    }
    return true;
  }

return false;
// we return false by default but if there is a link in the msg we return true 
}


export async function checkPassingCaptchaWithText(ctx, next) {
  // Check if it is a message is from a candidates
  if (
    !ctx.dbchat.candidates.length ||
    !ctx.dbchat.candidates.map((c) => c.id).includes(ctx.from.id)
  ) {
    return next()
  }
  // Check if it is not a text message in a strict mode
  if (!ctx.message?.text) {
    if (ctx.dbchat.strict) {
      deleteMessageSafe(ctx)
    }
    return next()
  }
  // Check if it is a button captcha (shouldn't get to this function then)
  if (ctx.dbchat.captchaType === CaptchaType.BUTTON) {
    
    if (MessageHasLink(ctx)) {
      return next() //check if msg has link and also kick member if true
    }
    
    // Delete message of restricted
    if (ctx.dbchat.strict) {
      deleteMessageSafe(ctx)
    }
    // Exit the function
    return next()
  }
  // Get candidate
  const candidate = ctx.dbchat.candidates
    .filter((c) => c.id === ctx.from.id)
    .pop()
  // Check if it is digits captcha
  if (candidate.captchaType === CaptchaType.DIGITS) {
    // Check the format
    
    if (MessageHasLink(ctx)) {
      return next() //check if msg has link and also kick member if true
    }

    const hasCorrectAnswer = ctx.message.text.includes(
      candidate.equationAnswer as string
    )
    const hasNoMoreThanTwoDigits =
      (ctx.message.text.match(/\d/g) || []).length <= 2
    if (!hasCorrectAnswer || !hasNoMoreThanTwoDigits) {
      if (ctx.dbchat.strict) {
        deleteMessageSafe(ctx)
      }
      return next()
    }
    // Delete message to decrease the amount of messages left
    deleteMessageSafe(ctx)
  }
  // Check if it is image captcha
  if (candidate.captchaType === CaptchaType.IMAGE) {
    const hasCorrectAnswer = ctx.message.text.includes(candidate.imageText)
    
    if (MessageHasLink(ctx)) {
      return next() //check if msg has link and also kick member if true
    }

    if (!hasCorrectAnswer) {
      if (ctx.dbchat.strict) {
        deleteMessageSafe(ctx)
      }
      return next()
    }
    // Delete message to decrease the amount of messages left
    deleteMessageSafe(ctx)
  }
  // Passed the captcha, delete from candidates
  await modifyCandidates(ctx.dbchat, false, [candidate])
  // Delete the captcha message
  deleteMessageSafeWithBot(ctx.chat!.id, candidate.messageId)
  // Greet user
  greetUser(ctx)
  console.log(
    'greeted a user',
    ctx.dbchat.captchaType,
    ctx.dbchat.customCaptchaMessage,
    ctx.dbchat.greetsUsers
  )
  if (
    candidate.captchaType === CaptchaType.DIGITS ||
    candidate.captchaType === CaptchaType.IMAGE
  ) {
    addVerifiedUser(ctx.from.id)
  }
  return next()
}
