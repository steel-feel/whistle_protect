import { readEml } from 'eml-parse-js'

export function isValidEml(fileContent: string) {
  
  const parsedEml = readEml(fileContent);
  console.log({parsedEml});
  
  //@ts-ignore
  const to = extractEmail(parsedEml.headers.To)
    //@ts-ignore
  const from = extractEmail(parsedEml.headers.From)
 
 /*
  // TODO: verfy bodyHash locally
  const parseEml = parseEmail(fileContent);
    const { canonicalizedBody, dkim } =
      parseEmailToCanonicalized(fileContent);

    if (!verifyBody(canonicalizedBody, dkim)) {
      throw new Error("Invalid eml. Siganture mismatch.");
    }

    const { to, from } = extractEmailAddresses(parseEml.headers);
*/
    if( to.emailDomain !== from.emailDomain ) {
      throw new Error("from/to mismatch. Email should be an internal email. ");
    }

    return to.emailDomain;
}

export function extractEmailAddresses(headers: any[]) {
    let to: string = "",
      from: string = "";
    for (const header of headers) {
      switch (header.key.toLowerCase()) {
        case "to":
          to = header.value;
          break;
        case "from":
          from = header.value;
          break;
      }
    }
    return { to : extractEmail(to), from : extractEmail(from)};
}


function extractEmail(email: string) {
    let indexofat = 0;
    for (let i = 0; i < email.length; i++) {
      if (email.charAt(i) == "@") {
        indexofat = i;
        break;
      }
    }

    // console.log({indexofat});

    let emailArr = ["@"], domainArr = [],
      j = indexofat - 1,
      k = indexofat + 1,
      breakj = true,
      breakk = true;

    while (breakj || breakk) {
      if (email.charAt(j) == "<" || email.charAt(j) == `'` || email.charAt(j) == `"`) {
        breakj = false;
      }
      if (email.charAt(k) == ">" || email.charAt(k) == `'` || email.charAt(k) == `"`) {
        breakk = false;
      }

      if (breakk) {
        emailArr.push(email.charAt(k));
        domainArr.push(email.charAt(k));
        k++;
      }
      if (breakj) {
        emailArr.unshift(email.charAt(j));
        j--;
      }
    }

    const parsedEmail = emailArr.join("");

    return {email: parsedEmail, emailDomain : domainArr.join("") };
}