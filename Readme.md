# imp

    # rate limit the user/examiner
    # proct from dos/ddos
    # limit user from accessing other's data like chat,file,exam etc
    # look for code/sql/etc injection
    # run a seprate server for checking paper like docker , in container the answer will compare and it will return  a unique/token unique(JWT token), which contains result and user info for that exam it which
    #  the server will decrpty the token and find user , map result to theme and the exam
    #  encrypt you connection,etc
    # filter input for both the user and examiner
    # answers will have it's own seprate mongoDb/nosql database
    # use graphql for easy way to intercept and send data
    # the hash will be decrypt in container only and other procces, the answers db should be called in the container
    # the user/student exam token will contian object id of exam paper and it will search that exam paper answer in the database

# fetaures

    # chat/group chat of particulre crouse and normal/gernal too
    # live test giving stream
    # can chat to admin or examiner in case of douts via chat 
    # if examiner approver ,the client can video/voice call examiner
    # dashboard for exmainer
    # dashboard for student if , the student wish to make account on the service
    # unique code for exam like object id of that quetion paper
    # student can skip login and give exam via providing name,unique it of exame
    # the student will be assingend a unique token during the exam to verfiy theme, the token should be valid till the exam end it's depends on the time condition of the exam
    # a resource page for the student 
    # exam givin by studnet, the paper should be seen to the examiner on the other side, who has create that exam
    # the answer should be cheked using ai(optional, if we have budget for that)/ by exmainer to give marks to student, for mcq the exmainer can set answer to it and student can get result based on it.
    # check if answer is wrong or right
    # the exmainer can have recording/stream of the student, while the were giving the exam
    # download options for that resource 
    # student has record of given exam,pass/fail,marks etc detail related to it
    # put a way where if examiner what to share result/paper/etc or want to put student unique it then he can just via a text/docx/pdf file
    # if the unique id is not map then map ,it when user enterd it 
    # cache data/exam paper so it doesn't make any load on database  

# if posible

    # we need someone who has knowldge about ai 
    # he/she/etc can make an ai modle, which process the video and check if student is cheating or not
    # if the sudent is cheating then the alert will be shown to examiner and examiner can take actions based on it,
    # if examiner wants to infro higher auth then , examiner have to provide, email id of theme and email will be sent, to confrime/student realte details and what he did,


    # include block option too in every like block from exam/block from group etc

# Backend

    # limit the database search return or search by using take and skip in primsa and monogodb
    # rewrite the status code arrcoding to the correct usage
    # debug and and test code 
    # do indexing of database table 
    # use Caching
    # put antivirus check for file upload
    #comprase file
    #write auth middelware for examdata verfiy
    # add message to response 
    # make loger and mointer activty of the user for data purose or handling servers
    # put return message
    #should set cookie or seesion token option
    #implement token base verifaction methode

# imp

# rember to rewrite and check code working
kafka is need in backend as there are many live action to be handle
and radit mq



# know handle why message is not to user in same group in backend;
    add security feature in websocket , so that anybody can not connect , whithout access to it 
    becaue if ther is no feature such as this , any body can connect to it and websocket server can be ddos,dos


# make a seprate file which, checks if all the services of you're app are running like rabbitmq,database,websocket ,etc 
and then use or call file in index.ts/index.js file as it will ensure that all things are running and working propley.
i'll give it a name , named pre-final stage