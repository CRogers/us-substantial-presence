
import org.gradle.api.Task
import org.gradle.api.tasks.Exec
import org.gradle.script.lang.kotlin.dependencies
import org.gradle.script.lang.kotlin.task
import org.gradle.script.lang.kotlin.testCompile

buildscript {
    repositories {
        jcenter()
    }

    dependencies {
        val serenityVersion = "1.1.42"
        classpath("net.serenity-bdd:serenity-gradle-plugin:$serenityVersion")
    }
}

apply {
    plugin("net.serenity-bdd.aggregator")
}

dependencies {
    testCompile("org.seleniumhq.selenium:selenium-chrome-driver:3.0.1")

    val serenityVersion = "1.1.42"
    testCompile("net.serenity-bdd:serenity-core:$serenityVersion")
    testCompile("net.serenity-bdd:serenity-junit:$serenityVersion")
    testCompile("net.serenity-bdd:serenity-screenplay:$serenityVersion")
    testCompile("net.serenity-bdd:serenity-screenplay-webdriver:$serenityVersion")

    testCompile("ch.qos.logback:logback-classic:1.1.7")
    testCompile("com.palantir.docker.compose:docker-compose-rule:0.28.1")
}

val buildFrontend = task<Exec>("buildFrontend") {
    setExecutable("./webpack")
    setWorkingDir("../frontend")
}

val openReports = task<Exec>("openReports") {
    setExecutable("open")
    setArgs(listOf("target/site/serenity/build-info.html"))
}

val test: Task = tasks.getByName("test")
val clearReports: Task = tasks.getByName("clearReports")
val aggregate: Task = tasks.getByName("aggregate")
val checkOutcomes: Task = tasks.getByName("checkOutcomes")

task("etes") {
    dependsOn(
        test,
        aggregate,
        checkOutcomes
    )
}

test.dependsOn(clearReports)
test.dependsOn(buildFrontend)
test.outputs.upToDateWhen { false }

aggregate.mustRunAfter(test)
checkOutcomes.mustRunAfter(aggregate)