import { gql } from '@apollo/client';

const fragments = {
  post: gql`
      fragment post on PostInfo {
        id
        text
        video
        thumbnail
        promoteId
        shopId
        likeCount
        commentCount
        createdAt
        pinLocation {
          lat
          lon
        }
        author {
          itemName
          avatar
          id
          meFollowed
        }
      }
    `,
  comment: gql`
      fragment comment on CommentInfo {
        id
        text
        likeCount
        commentCount
        createdAt
        author {
          itemName
          avatar
          id
        }
      }
    `,
  page: gql`
      fragment page on PageInfo {
        hasNextPage
        endCursor
      }
    `,
  relation: gql`
      fragment relation on Relation {
      id
      isLiked
      isViewed
      isSaved
      }
    `,
  // me: gql`
  //   fragment me on Me {
  //     id
  //     itemName
  //     avatar
  //     firstName
  //     lastName
  //     email
  //     phoneNumber
  //     address
  //     tambon
  //     amphoe
  //     changwat
  //     zipcode
  //     website
  //     badgeCount
  //     notification {
  //       avatar
  //       text
  //       createdAt
  //     }
  //     shop{
  //       id
  //       name
  //     }
  //     group {
  //       id
  //       name
  //       public
  //       groupPic
  //     }
  //     following {
  //       id
  //       itemName
  //       avatar
  //     }
  //     userHavePost
  //   }
  // `,
  user: gql`
      fragment user on User {
        id
        itemName
        avatar
        firstName
        lastName
        streamKey
        email
        adMediaName
        address
        tambon
        amphoe
        changwat
        zipcode
        website
        headerPic
        phoneNumber
        userHavePost
        followerCount
        info
        streak
        pinLocation {
          lat
          lon
        }
        earningHistory {
          date
          amount
        }
        followingUser 
        followingShop 
      }
    `,
  product: gql`
      fragment product on Product {
        id
        itemName
        meSaved
        tag
        price
        phoneNumber
        pictures
        author{
          id
          itemName
          avatar
        }
        secondHand
        detail
        place
        tambon
        amphoe
        changwat
        miles
        model
        brand
        memory
        truckType
        year
        fuel
        gear
        color
        type
        area
        bathroom
        bedroom
        jobType
        payment
        myReview {
          id
          text
          star
          createdAt
        }
        category
        createdAt
      }
    `,
  previewProduct: gql`
      fragment previewProduct on PreviewProduct {
        id
        itemName
        author {
          id
          itemName
          avatar
        }
        meSaved
        price
        phoneNumber
        pictures
        tambon
        amphoe
        changwat
        createdAt
      }
    `,
  shop: gql`
      fragment shop on Shop {
        id
        itemName
        ratingScore
        description
        admin 
        mod 
        avatar
        phrase
        headerPic
        images
        videos
        isOpen
        next
        pinLocation {
          lat
          lon
        }
        openTime {
            monday {
              opens
              closes
            }
            tuesday {
              opens
              closes
            }
            wednesday {
              opens
              closes
            }
            thursday {
              opens
              closes
            }
            friday {
              opens
              closes
            }
            saturday {
              opens
              closes
            }
            sunday {
              opens
              closes
            }
        }
        phoneNumber
        email
        avgRating
        fivestarCount
        fourstarCount
        threestarCount
        twostarCount
        onestarCount
        followerCount
        reviewCount
        viewCount
        haveStoreFront
        address
        tambon
        amphoe
        changwat
        type
        category
        myReview {
          id
          text
          star
          createdAt
        }
        createdAt
      }
    `,
  review: gql`
      fragment review on Review {
        id
        star
        author {
          id
          itemName
          avatar
        }
        text
        reply
        createdAt
      }
    `,
  ad: gql`
      fragment ad on Ad {
        pk
        id
        isPromote
        isAdmob
        text
        image
        impression
        budget
        startBudget
        status
        tambon
        amphoe
        changwat
        region
        all
        shop {
          id
          itemName
          avatar
        }
        product {
          id
          itemName
          avatar
        }
      }
    `,
  notification: gql`
    fragment notification on Notification {
      id
      text
      avatar
      unseen
      createdAt
    }
  `,
  address: gql`
    fragment address on Address {
      Name
      TambonThai
      AmphoeThai
      ChangwatThai
      PostCodeMain
      officialRegion
    }
  `,
  room: gql`
    fragment room on Room {
      pk
      id
      member {
        id 
        itemName
        avatar
      }
    }
  `,
  message: gql`
    fragment message on Message {
      pk
      id
      senderId
      readId
      text
      images
      video
      wasRead
      createdAt
    }
  `,
  column: gql`
    fragment column on Column {
      id
      itemName
      admin
      mod
      email
      phoneNumber
      avatar
      headerPic
      info
      website
      category
      followerCount
      createdAt
    }
    `,
}

export default fragments;