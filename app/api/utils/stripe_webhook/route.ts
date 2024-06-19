import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { sendMail } from '@/app/lib/mail';
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

async function handler(req: NextRequest) {
  //const supabase = createServerComponentClient({ cookies });
  const reqText = await req.text();
  return webhooksHandler(reqText, req);
}
export { handler as GET, handler as POST };
async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return (customer as Stripe.Customer).email;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: 'created' | 'updated' | 'deleted'
) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerEmail = await getCustomerEmail(subscription.customer as string);
  //const session = await getServerSession(options)
  //const username = session?.user?.name
  //console.log(username)
  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: 'Customer email could not be fetched',
    });
  }

  const subscriptionData = {
    subscription_id: subscription.id,
    stripe_user_id: subscription.customer,
    status: subscription.status,
    start_date: new Date(subscription.created * 1000).toISOString(),
    plan_id: subscription.items.data[0]?.price.id,
    user_id: subscription.metadata?.userId || '',
    email: customerEmail,
  };
 console.log(subscription.metadata?.userId)
  let newkey,keys,selection;
  if (type === 'deleted') {
    console.log('d')
    selection = { user_id: subscription.metadata?.userId};
    keys = await db.subScription.findMany({
      where: selection,
      select: {
        id:true
      },
    }); 
    if (keys.length!=0) {
    newkey = await db.subScription.update({
        where: {id:keys[0].id},
        data:{
          subscription_id: subscription.id,
          stripe_user_id: subscription.customer.toString(),
          status: subscription.status,
          start_date: new Date(subscription.created * 1000),
          plan_id: subscription.items.data[0]?.price.id,
          user_id: subscription.metadata?.userId || '',
          email: customerEmail,
        }
      })
      console.log(newkey)}
  } else if (type =='updated' && subscription.metadata?.userId ) {
    console.log('ui')
  selection = { user_id: subscription.metadata?.userId};
  keys = await db.subScription.findMany({
    where: selection,
    select: {
      id:true
    },
  }); 
    if (keys.length === 0) {
     newkey = await db.subScription.create({
        data:{
          subscription_id: subscription.id,
          stripe_user_id: subscription.customer.toString(),
          status: subscription.status,
          start_date: new Date(subscription.created * 1000),
          plan_id: subscription.items.data[0]?.price.id,
          user_id: subscription.metadata?.userId || '',
          email: customerEmail,
        }
      })
      console.log(newkey)}
      else {newkey = await db.subScription.update({
        where: {id:keys[0].id},
        data:{
          subscription_id: subscription.id,
          stripe_user_id: subscription.customer.toString(),
          status: subscription.status,
          start_date: new Date(subscription.created * 1000),
          plan_id: subscription.items.data[0]?.price.id,
          user_id: subscription.metadata?.userId || '',
          email: customerEmail,
        }
      })
      console.log(newkey)}
  }
  if (newkey) {
  return NextResponse.json({
    status: 200,
    message: `Subscription ${type} success`,
    newkey,
  });}
  else {return NextResponse.json({
    status: 500,
    message: `Subscription ${type} failed`,
    newkey,
  });}
}

async function handleInvoiceEvent(
  event: Stripe.Event,
  status: 'succeeded' | 'failed'
) {
  const invoice = event.data.object as Stripe.Invoice;
  const customerEmail = await getCustomerEmail(invoice.customer as string);
  console.log(customerEmail)
  console.log(invoice.customer)
  if (!customerEmail) {
    return NextResponse.json({
      status: 500,
      error: 'Customer email could not be fetched',
    });
  }
  
 /*
  const invoiceData = {
    invoice_id: invoice.id,
    subscription_id: invoice.subscription as string,
    amount_paid: status === 'succeeded' ? invoice.amount_paid / 100 : undefined,
    amount_due: status === 'failed' ? invoice.amount_due / 100 : undefined,
    currency: invoice.currency,
    status,
    user_id: invoice.metadata?.userId,
    email: customerEmail,
  };*/
  let newkey;
  let selection = { stripe_user_id: invoice.customer?.toString()};
  let keys = await db.subScription.findMany({
    where: selection,
    select: {
      id:true,
      user_id:true
    },
  }); 
  if (status==='succeeded') {newkey = await db.subScription.update({
    where: {id:keys[0].id},
    data:{
      status: 'active',
    }
  })
  
  console.log(newkey)}
  else {newkey = await db.subScription.update({
    where: {id:keys[0].id},
    data:{
      status: 'canceled',
    }
  })
  console.log(newkey)
  if (keys[0].user_id) {
  let selection2 = {id:keys[0].user_id}
  let keys2 = await db.user.findMany({
    where: selection2,
    select: {
      id:true,
      email:true,
      name:true
    },
  }); 
if (keys2[0].email && keys2[0].name) {
  let mess = 'ChatG6 failed to process payment from your credit card. Your subscription is paused temprarly. You can renew it anytime'
  sendMail(keys2[0].email,'Payment Completion',mess,keys2[0].name)}
}
  //sendMail()
  }
  if (newkey) 
  //await stripe.invoices.update(invoice.id as string,status);
  {return NextResponse.json({
    status: 200,
    message: `Invoice payment ${status}`,
  });}
  else {return NextResponse.json({
    status: 500,
    message: `Invoice payment ${status}`,
  });}
}

async function handleCheckoutSessionCompleted(
  event: Stripe.Event
) {
  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = session.metadata;
  //console.log(metadata)
  if (metadata?.subscription === 'true') {
    const subscriptionId = session.subscription;
    try {
      await stripe.subscriptions.update(subscriptionId as string, { metadata });

      //await stripe.subscriptions.cancel(subscriptionId as string)

      return NextResponse.json({
        status: 200,
        message: 'Subscription metadata updated successfully',
      });
    } catch (error) {
      console.error('Error updating subscription metadata:', error);
      return NextResponse.json({
        status: 500,
        error: 'Error updating subscription metadata',
      });
    }
  } else {
    const dateTime = new Date(session.created * 1000).toISOString();
    try {

      const paymentData = {
        user_id: metadata?.userId,
        stripe_id: session.id,
        email: metadata?.email,
        amount: session.amount_total! / 100,
        customer_details: JSON.stringify(session.customer_details),
        payment_intent: session.payment_intent,
        payment_time: dateTime,
        currency: session.currency,
      };


      return NextResponse.json({
        status: 200,
        message: 'Payment and credits updated successfully',
      });
    } catch (error) {
      console.error('Error handling checkout session:', error);
      return NextResponse.json({
        status: 500,
        error,
      });
    }
  }
}

async function webhooksHandler(
  reqText: string,
  request: NextRequest
): Promise<NextResponse> {
  const sig = request.headers.get('Stripe-Signature');
  //console.log(sig)
  //console.log(request.headers)
  try {
    const event = await stripe.webhooks.constructEventAsync(
      reqText,
      sig!,
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!

    );
    console.log(event.type)
    switch (event.type) {
      case 'customer.subscription.created':
        return handleSubscriptionEvent(event, 'created');
      case 'customer.subscription.updated':
        return handleSubscriptionEvent(event, 'updated');
      case 'customer.subscription.deleted':
        return handleSubscriptionEvent(event, 'deleted');
      case 'invoice.payment_succeeded':
        return handleInvoiceEvent(event, 'succeeded');
      case 'invoice.payment_failed':
        return handleInvoiceEvent(event, 'failed');
      case 'checkout.session.completed':
        return handleCheckoutSessionCompleted(event);
      default:
        return NextResponse.json({
          status: 400,
          error: 'Unhandled event type',
        });
    }
  } catch (err) {
    console.error('Error constructing Stripe event:', err);
    return NextResponse.json({
      status: 500,
      error: 'Webhook Error: Invalid Signature',
    });
  }
}