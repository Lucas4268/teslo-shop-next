import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt'


export const middleware = async( req: NextRequest ) => {

  // ####################################### paginas dentro de checkout #######################################
  if ( req.nextUrl.pathname.startsWith('/checkout/' )) {
    // const token = req.cookies.get( 'token' ) || ''
  
    // try {
    //   await jwtVerify( token, new TextEncoder().encode( process.env.JWT_SECRET_SEED ) );
    //   return NextResponse.next();
      
    // } catch (error) {
    //   console.log(error)
    //   const { pathname, origin } = req.nextUrl.clone()
      
    //   return NextResponse.redirect(`${ origin }/auth/login?p=${ pathname }`)
    // }

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if ( !session ) {
      const { pathname, origin } = req.nextUrl.clone()
      return NextResponse.redirect(`${ origin }/auth/login?p=${ pathname }`)
    }

    return NextResponse.next();
  }



  // ####################################### paginas dentro de admin #######################################
  if ( req.nextUrl.pathname.startsWith('/admin' )) {
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname, origin } = req.nextUrl.clone();

    if ( !session ) {
      return NextResponse.redirect(`${ origin }/auth/login?p=${ pathname }`);
    };

    const validRoles = ['admin', 'SEO'];

    if ( !validRoles.includes( session.user.role ) ) {
      return NextResponse.redirect(`${ origin }/`);
    };

    return NextResponse.next();
  }



  // ####################################### api de admin #######################################
  if ( req.nextUrl.pathname.startsWith('/api/admin' )) {
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname, origin } = req.nextUrl.clone();

    if ( !session ) {
      return NextResponse.redirect(`${ origin }/auth/login`);
    };
    
    const validRoles = ['admin', 'SEO'];
    if ( !validRoles.includes( session.user.role ) ) {
      return NextResponse.redirect(`${ origin }/`);
    };

    return NextResponse.next();
  };
}

export const config = {
  matcher: [
    '/checkout/:path',
    '/admin',
    '/admin/:path',
    '/api/admin/:path',
  ],
}